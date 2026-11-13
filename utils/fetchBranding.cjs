const fs = require("fs");
const path = require("path");

/* ==============================================
 * CONFIGURATION
 * ============================================== */

/**
 * Reads the local config file.
 *
 * @param {string} rootDir
 * @returns {{ "brand-url": string, "app-name": string, platforms?: object, "platforms-menu"?: boolean }}
 */
function readAppConfig(rootDir) {
    const configFile = path.join(rootDir, "configuration", "api", "config.json");

    try {
        return JSON.parse(fs.readFileSync(configFile, "utf8"));
    } catch (error) {
        throw new Error(
            `Failed to load app configuration from "${configFile}": ${error.message}`,
            { cause: error }
        );
    }
}

/**
 * Builds the branding endpoint from brand-url.
 *
 * @param {{ "brand-url"?: string }} appConfig
 * @returns {string}
 */
function resolveBrandingUrl(appConfig) {
    const baseUrl = String(appConfig?.["brand-url"] || "").trim().replace(/\/$/, "");

    if (!baseUrl) {
        throw new Error("App configuration is missing a brand-url.");
    }

    return `${baseUrl}/branding`;
}

/* ==============================================
 * BRANDING
 * ============================================== */

/**
 * Grabs brand data from the IF API.
 *
 * @param {string} rootDir
 * @returns {Promise<object>}
 */
async function fetchBranding(rootDir) {
    const brandingUrl = resolveBrandingUrl(readAppConfig(rootDir));

    let response;

    try {
        response = await fetch(brandingUrl);
    } catch (error) {
        throw new Error(
            `Failed to reach branding API at "${brandingUrl}": ${error.message}`,
            { cause: error }
        );
    }

    if (!response.ok) {
        throw new Error(
            `Branding API returned HTTP ${response.status} for "${brandingUrl}".`
        );
    }

    return response.json();
}

/**
 * Reads the app-name from config.
 *
 * @param {string} rootDir
 * @returns {string}
 */
function getAppName(rootDir) {
    const appName = String(readAppConfig(rootDir)?.["app-name"] || "").trim();

    if (!appName) {
        throw new Error("App configuration is missing an app-name.");
    }

    return appName;
}

module.exports = {
    fetchBranding,
    getAppName
};
