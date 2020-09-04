require("./globals");

const del  = require("del");
const path = require("path").posix;

const { series } = require("gulp");

const DEST_FOLDER = global.CONFIG.buildDestinationDirectory;
const TEMP_FOLDER = path.join(DEST_FOLDER, "temp");

/**
 * Clean-up. Recursively removes the destination folder.
 */
function cleanup(cb) {
	del(DEST_FOLDER, { force: true }).then(() => cb());
}

/**
 * Post-cleanups.
 */
function postCleanup(cb) {
	del(TEMP_FOLDER, { force: true }).then(() => cb());
}

const sharedTasks = require("./tasks/shared");
const serverTasks = require("./tasks/server");
const clientTasks = require("./tasks/client");
const travisTasks = require("./tasks/travis");
const travisChecksTasks = require("./tasks/travis/checks");
const curseForgeTasks = require("./tasks/deploy/curseforge");
const metaTasks = require("./tasks/meta");

const buildServer = series(
	cleanup,
	...metaTasks,
	...sharedTasks,
	...serverTasks,
	postCleanup
);

const buildClient = series(
	cleanup,
	...metaTasks,
	...sharedTasks,
	...clientTasks,
	postCleanup,
)

const buildAll = series(
	cleanup,
	...metaTasks,
	...sharedTasks,
	...serverTasks,
	...clientTasks,
	postCleanup
)

const travis = series(
	...travisTasks
)

const travisChecks = series(
	...travisChecksTasks
)

const deployCurseForge = series(
	...metaTasks,
	...curseForgeTasks
)

module.exports = {
	buildServer: buildServer,
	buildClient: buildClient,
	buildAll: buildAll,
	travis: travis,
	travisChecks: travisChecks,
	deployCurseForge: deployCurseForge
}
