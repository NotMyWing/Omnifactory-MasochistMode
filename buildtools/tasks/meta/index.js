const { Octokit } = require("@octokit/rest");
const REGEX_SLUG = /(.+)\/(.+)/;

/**
 * Transform the version field of manifest.json.
 */
async function transformManifestVersion(cb) {
	let versionTitle = global.MODPACK_MANIFEST.name;

	if (process.env.TRAVIS) {
		// Untagged Build
		if (process.env.TRAVIS_TAG !== process.env.TRAVIS_BRANCH) {
			versionTitle += ` (${process.env.TRAVIS_BRANCH}, ${process.env.TRAVIS_COMMIT.substr(0, 7)})`
		}
		// Tagged Build
		else {
			const parsedSlug = REGEX_SLUG.exec(process.env.TRAVIS_REPO_SLUG);
			if (!parsedSlug) {
				cb(`Malformed GitHub repository slug: ${process.env.TRAVIS_REPO_SLUG}`);
			}
			
			const slug = {
				owner: parsedSlug[1],
				repo: parsedSlug[2],
			};

			const octokit = new Octokit({
				auth: process.env.GITHUB_TOKEN
			});

			// Fetch the tag SHA
			const tagRef = await octokit.git.getRef({
				...slug,
				ref: `tags/${process.env.TRAVIS_TAG}`
			});

			if (!tagRef) {
				cb(`Couldn't look up tag ${process.env.TRAVIS_TAG}`);
			}

			// Fetch the tag message
			const tagInfo = await octokit.git.getTag({
				...slug,
				tag_sha: tagRef.data.object.sha
			});

			const version = tagInfo.data.tag.replace(/^v/, "");

			global.SERVER_PACK_NAME = `${versionTitle} Server ${version}`;
			versionTitle += ` - ${version} - ${tagInfo.data.message.replace(/\n/g, "")}`;
		}
	} else {
		versionTitle += " (manual build)";
	}

	global.MODPACK_MANIFEST.name = versionTitle;
	
	cb();
}

module.exports = [
	transformManifestVersion
];
