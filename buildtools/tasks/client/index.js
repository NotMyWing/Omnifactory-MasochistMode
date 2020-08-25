const fs = require("fs");
const log = require("fancy-log");
const path = require("path").posix;
const zip = require("gulp-zip");
const Promise = require("bluebird");
const Jimp = require("jimp");
const glob = require("glob");
const mustache = require("mustache");

const { retryRequest } = require("../../util/downloaders.js");

const { src, dest } = require("gulp");

const DEST_FOLDER = global.CONFIG.buildDestinationDirectory;
const SHARED_DEST_FOLDER = path.join(DEST_FOLDER, "shared");
const CLIENT_DEST_FOLDER = path.join(DEST_FOLDER, "client");
const TEMP_FOLDER = path.join(DEST_FOLDER, "temp");

function createClientDirs(cb) {
	const toCreate = [
		CLIENT_DEST_FOLDER,
		TEMP_FOLDER
	];

	toCreate.forEach((dir) => {
		log(`Creating folder ${path.normalize(dir)}`);
		fs.mkdirSync(dir, { recursive: true })
	});

	cb();
}

/**
 * Saves the modpack manifest.
 */
function saveModpackManifest(cb) {
	const manifestPath = path.join(CLIENT_DEST_FOLDER, "manifest.json");
	fs.writeFileSync(manifestPath, JSON.stringify(global.MODPACK_MANIFEST, null, "  "));

	cb();
}

/**
 * Copies the license file.
 */
function copyClientLicense() {
	return src("../LICENSE.md")
		.pipe(dest(CLIENT_DEST_FOLDER));
}

/**
 * Copies modpack overrides.
 */
function copyClientOverrides() {
	const basedir = path.join(SHARED_DEST_FOLDER, global.OVERRIDES_FOLDER);
	return src(
		global.CONFIG.copyOverridesClientGlobs
			.map(glob => path.join(basedir, glob))

		, { base: path.join(basedir, "..") }
	)
		.pipe(dest(CLIENT_DEST_FOLDER));
}

/**
 * Fetches mod links and builds modlist.html.
 */
function fetchModList(cb) {
	log("Fetching mods...");

	/**
	 * Fetch file descriptions for download urls and hashes
	 * by mapping files to Promises.
	 */
	Promise.map(global.MODPACK_MANIFEST.files, file => {
		return retryRequest(
			global.CONFIG.downloaderMaxRetries
			, {
				uri: `https://addons-ecs.forgesvc.net/api/v2/addon/${file.projectID}`
				, json: true
			}
		)
	}, { concurrency: global.CONFIG.downloaderConcurrency }).then(modInfos => {
		const output = [
			"<ul>\r\n",
			...modInfos
				.sort((a, b) => a.id - b.id)
				.map(modInfo => {
					return `\t<li><a href="${modInfo.websiteUrl}">${modInfo.name} (by ${
						modInfo.authors[0].name
						})</a></li>\r\n`
				}),
			"</ul>",
		];

		fs.writeFile(path.join(CLIENT_DEST_FOLDER, "modlist.html"), output.join(""), () => {
			cb();
		})
	})
}

/**
 * Zips the client directory.
 */
function zipClient() {
	return src(path.join(CLIENT_DEST_FOLDER, "**"), { nodir: true, base: CLIENT_DEST_FOLDER })
		.pipe(zip("client.zip"))
		.pipe(dest(DEST_FOLDER));
}

async function createStabilizedMMSprites(cb) {
	const files = await new Promise((resolve, reject) => {
		glob.Glob(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
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

	let zs = "#loader contenttweaker"
		+ "\nimport mods.contenttweaker.VanillaFactory;"
		+ "\nimport mods.contenttweaker.Item;"
		+ "\n\n";

	let imageId = 0;
	for (const imagePath of files) {
		const extension = path.extname(imagePath);
		const shipName = path.basename(imagePath)
			.replace(new RegExp(`\\.${extension.substr(1)}$`), "")
			+ "_stabilized";

		zs += mustache.render(ctPattern, {
			name: shipName
		});

		const ship = await Jimp.read(imagePath);
		const infinity = new Jimp(overlay);

		infinity.resize(ship.getWidth(), ship.getHeight());

		infinity.scan(0, 0, infinity.getWidth(), infinity.getHeight(), (x, y, idx) => {
			infinity.bitmap.data[idx + 3] = ship.bitmap.data[idx + 3]
		});

		ship.composite(infinity, 0, 0, {
			mode: Jimp.BLEND_SCREEN,
			opacitySource: 0.75
		});

		const frames = 9;
		const output = new Jimp(ship.getWidth(), ship.getHeight() * frames);

		for (let i = 0; i < frames; i++) {
			let frame = ship;
			if (i > 0) {
				frame = new Jimp(frame)
					.color([{
						apply: "brighten", params: [(i / frames) * 60]
					}])
			}

			output.blit(frame, 0, i * ship.getHeight());
		}

		await output.write(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
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

		fs.writeFileSync(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
			"resources/contenttweaker/textures/items/",
			shipName + extension + ".mcmeta"
		), JSON.stringify(mcmeta, null, "  "))

		const model = {
			"parent": "item/generated",
			"textures": {
				"layer0": `contenttweaker:items/${shipName}`
			}
		}

		fs.writeFileSync(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
			"resources/contenttweaker/models/item/",
			shipName + ".json"
		), JSON.stringify(model, null, "  "))

		const colorfulMatter = new Jimp(matter).color([{
			apply: "hue", params: [(imageId / files.length) * 360]
		}])

		await colorfulMatter.write(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
			"resources/contenttweaker/textures/items/",
			shipName + "_matter" + extension
		));

		const colorfulMatterModel = {
			"parent": "item/generated",
			"textures": {
				"layer0": `contenttweaker:items/${shipName}_matter`
			}
		}

		fs.writeFileSync(path.join(
			CLIENT_DEST_FOLDER,
			global.OVERRIDES_FOLDER,
			"resources/contenttweaker/models/item/",
			shipName + "_matter" + ".json"
		), JSON.stringify(colorfulMatterModel, null, "  "))

		imageId++;
	}

	await fs.promises.writeFile(path.join(
		CLIENT_DEST_FOLDER,
		global.OVERRIDES_FOLDER,
		"scripts/StabilizedShips.zs"
	), zs);

	cb();
}

module.exports = [
	createClientDirs,
	saveModpackManifest,
	copyClientOverrides,
	copyClientLicense,
	createStabilizedMMSprites,
	fetchModList,
	zipClient
]
