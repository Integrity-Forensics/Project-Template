const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    nativeImage
} = require("electron");

const path = require("path");
const { pathToFileURL } = require("url");

const { fetchBranding, getAppName } = require("../utils/fetchBranding.cjs");
const fetchDist = require("../utils/fetchDist.cjs");

/* ==============================================
 * CONFIGURATION
 * ============================================== */

const ROOT_DIR = path.resolve(__dirname, "..");

/*
 * Same color as --root-background in Root.css.
 * Electron can't read CSS variables for the
 * native window fill, so we just keep a matching
 * constant here.
 */
const WINDOW_BACKGROUND = "#101114";

/* ==============================================
 * WINDOW
 * ============================================== */

let win;
let windowBrand = {
    name: "",
    logo: ""
};

/**
 * Downloads the brand logo so Electron can use it
 * as the window icon.
 *
 * @param {object} brand
 * @returns {Promise<import("electron").NativeImage | undefined>}
 */
async function loadWindowIcon(brand) {
    const logoUrl = brand.logo || brand.logos?.background;

    if (!logoUrl) return undefined;

    try {
        const response = await fetch(logoUrl);

        if (!response.ok) return undefined;

        const image = nativeImage.createFromBuffer(
            Buffer.from(await response.arrayBuffer())
        );

        if (image.isEmpty()) return undefined;

        return image;
    } catch {
        return undefined;
    }
}

/**
 * Finds which window sent the IPC event.
 *
 * @param {import("electron").IpcMainEvent | import("electron").IpcMainInvokeEvent} event
 * @returns {BrowserWindow | null}
 */
function windowFromEvent(event) {
    const target = BrowserWindow.fromWebContents(event.sender);

    if (!target) return null;

    return target;
}

/**
 * Wires up the custom title bar actions.
 *
 * @returns {void}
 */
function bindWindowControls() {
    ipcMain.on("window:minimize", (event) => {
        const target = windowFromEvent(event);

        if (!target) return;

        target.minimize();
    });

    ipcMain.on("window:close", (event) => {
        const target = windowFromEvent(event);

        if (!target) return;

        target.close();
    });

    ipcMain.handle("window:get-app-name", (event) => {
        const target = windowFromEvent(event);

        if (!target) return "";

        return getAppName(ROOT_DIR);
    });

    ipcMain.handle("window:get-brand", (event) => {
        const target = windowFromEvent(event);

        if (!target) {
            return {
                name: "",
                logo: ""
            };
        }

        return windowBrand;
    });
}

/**
 * Creates the main window.
 *
 * @param {object} brand
 * @param {import("electron").NativeImage | undefined} icon
 * @param {string} appName
 * @returns {void}
 */
function createWindow(brand, icon, appName) {
    if (!app.isReady()) return;

    win = new BrowserWindow({
        width: 1200,
        height: 750,
        backgroundColor: WINDOW_BACKGROUND,
        icon,
        frame: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.once("ready-to-show", () => {
        win.show();
    });

    const frameTitle = brand.name
        ? `${brand.name}: ${appName}`
        : appName;

    windowBrand = {
        name: brand.name || "",
        logo: brand.logos?.transparent || brand.logo || ""
    };

    /*
     * Vite likes to overwrite the window title with
     * the page title. We want brand + app name instead,
     * so just block those updates.
     */
    const applyTitle = () => {
        if (!win || win.isDestroyed()) return;

        win.setTitle(frameTitle);
    };

    win.webContents.on("page-title-updated", (event) => {
        event.preventDefault();
        applyTitle();
    });

    win.webContents.on("did-finish-load", applyTitle);
    applyTitle();

    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

    /*
     * Dev mode uses the Vite server.
     * Otherwise we load the built dist file.
     */
    if (devServerUrl) {
        win.loadURL(devServerUrl);
        win.webContents.openDevTools();

        return;
    }

    const distFile = fetchDist(ROOT_DIR);
    win.loadURL(pathToFileURL(distFile).href);
}

/* ==============================================
 * APPLICATION
 * ============================================== */

app.whenReady().then(async () => {
    /*
     * We don't use Electron's default menu, so
     * just remove it entirely.
     */
    Menu.setApplicationMenu(null);
    bindWindowControls();

    const brand = await fetchBranding(ROOT_DIR);
    const appName = getAppName(ROOT_DIR);
    const icon = await loadWindowIcon(brand);

    createWindow(brand, icon, appName);
});

app.on("window-all-closed", () => {
    app.quit();
});
