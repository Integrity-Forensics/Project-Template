const fs = require("fs");
const path = require("path");

/**
 * Finds the built index.html for production.
 *
 * @param {string} rootDir
 * @returns {string}
 */
function fetchDist(rootDir) {
    const distFile = path.join(
        rootDir,
        "dist",
        "index.html"
    );

    if (!fs.existsSync(distFile)) {
        throw new Error(
            `Production build not found at "${distFile}". Run the Vite build script first.`
        );
    }

    return distFile;
}

module.exports = fetchDist;
