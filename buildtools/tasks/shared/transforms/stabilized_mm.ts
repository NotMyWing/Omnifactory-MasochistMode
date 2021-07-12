import fs from "fs";
import upath from "upath";
import Jimp from "jimp";
import glob from "glob";
import mustache from "mustache";
import colorThief from "color-thief-jimp";

import { overridesFolder, sharedDestDirectory } from "../../../globals";

export default async function createStabilizedMM(): Promise<void> {
	const files: string[] = await new Promise((resolve, reject) => {
		new glob.Glob(upath.join(
			sharedDestDirectory,
			overridesFolder,
			"resources/contenttweaker/textures/items/tier*ship.png"
		), (err, files) => {
			if (err) {
				reject(err);
			}

			resolve(files);
		})
	});

	const overlay = await Jimp.read("assets/ste_infinity_overlay.png");
	const matter = await Jimp.read("assets/ste_matter.png");
	const ctPattern = (await fs.promises.readFile("assets/ste_mmPattern.zs")).toString();
	const tooltipPattern = (await fs.promises.readFile("assets/ste_mmTooltip.zs")).toString();

	let contentTweakerZS = "#loader contenttweaker"
		+ "\nimport mods.contenttweaker.VanillaFactory;"
		+ "\nimport mods.contenttweaker.Item;"
		+ "\n\n";

	let tooltipZS = "";

	for (const imagePath of files) {
		const extension = upath.extname(imagePath);
		const shipName = upath.basename(imagePath)
			.replace(new RegExp(`\\.${extension.substr(1)}$`), "")
			+ "_stabilized";

		contentTweakerZS += mustache.render(ctPattern, {
			name: shipName
		});

		tooltipZS += mustache.render(tooltipPattern, {
			name: shipName
		});

		const ship = await Jimp.read(imagePath);
		const infinity = new Jimp(overlay);
		const dominantColor = colorThief.getColor(new Jimp(ship)
			.gaussian(1)
			.contrast(0.33)
			.brightness(0.33)
		);

		infinity.resize(ship.getWidth(), ship.getHeight());
		infinity.scan(0, 0, infinity.getWidth(), infinity.getHeight(), (x, y, idx) => {
			infinity.bitmap.data[idx + 3] = ship.bitmap.data[idx + 3]
		});

		ship.composite(infinity, 0, 0, {
			mode: Jimp.BLEND_SCREEN,
			opacitySource: 0.75,
			opacityDest: 1
		});

		const frames = 9;
		const output = new Jimp(ship.getWidth(), ship.getHeight() * frames);

		for (let i = 0; i < frames; i++) {
			let frame = ship;
			if (i > 0) {
				frame = new Jimp(frame)
					.color([{
						apply: "brighten", params: [(i / frames) * 60]
					}] as any)
			}

			output.blit(frame, 0, i * ship.getHeight());
		}

		output.write(upath.join(
			sharedDestDirectory,
			overridesFolder,
			"resources/contenttweaker/textures/items/",
			shipName + extension
		));

		const mcmeta = {
			animation: {
				interpolate: true,
				frametime: 5,
				frames: [
					{ index: 0, time: 3 },
					{ index: 1, time: 3 },
					{ index: 2, time: 3 },
					{ index: 3, time: 2 },
					{ index: 4, time: 2 },
					5,
					6,
					7,
					8,
					7,
					6,
					5,
					{ index: 4, time: 2 },
					{ index: 3, time: 2 },
					{ index: 2, time: 3 },
					{ index: 1, time: 3 },
				]
			}
		}

		fs.writeFileSync(upath.join(
			sharedDestDirectory,
			overridesFolder,
			"resources/contenttweaker/textures/items/",
			shipName + extension + ".mcmeta"
		), JSON.stringify(mcmeta, null, "  "))

		const colorfulMatter = new Jimp(matter);
		colorfulMatter.scan(0, 0, colorfulMatter.getWidth(), colorfulMatter.getHeight(), (x, y, idx) => {
			for (let color = 0; color < 3; color++) {
				colorfulMatter.bitmap.data[idx + color] = Math.floor(
					(colorfulMatter.bitmap.data[idx + color] / 255) * dominantColor[color]
				);
			}
		});

		colorfulMatter.write(upath.join(
			sharedDestDirectory,
			overridesFolder,
			"resources/contenttweaker/textures/items/",
			shipName + "_matter" + extension
		));
	}

	await fs.promises.mkdir(upath.join(
		sharedDestDirectory,
			overridesFolder,
		"scripts/StabilizedShips"
	));

	await fs.promises.writeFile(upath.join(
		sharedDestDirectory,
			overridesFolder,
		"scripts/StabilizedShips/Content.zs"
	), contentTweakerZS);

	await fs.promises.writeFile(upath.join(
		sharedDestDirectory,
			overridesFolder,
		"scripts/StabilizedShips/Tooltips.zs"
	), tooltipZS);
}
