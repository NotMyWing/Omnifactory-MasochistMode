const fs = require("fs");
const path = require("path").posix;
const mustache = require("mustache");

const DEST_FOLDER        = global.CONFIG.buildDestinationDirectory;
const SHARED_DEST_FOLDER = path.join(DEST_FOLDER, "shared");

const randomPatchesConfigFile = "config/randompatches.cfg";

/**
 * Transform the version field of manifest.json.
 */
async function transformRandomPatches(cb) {
	const randomPatchesConfigFilePath = path.join(
		SHARED_DEST_FOLDER, global.OVERRIDES_FOLDER, randomPatchesConfigFile
	);

	const randomPatchesFile = (await fs.promises.readFile(randomPatchesConfigFilePath)).toString();

	await fs.promises.writeFile(randomPatchesConfigFilePath, mustache.render(randomPatchesFile, {
		title: global.MODPACK_MANIFEST.name
	}));
	
	cb();
}

module.exports = transformRandomPatches;
