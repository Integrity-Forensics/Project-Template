const { contextBridge, ipcRenderer } = require("electron");

/* ==============================================
 * WINDOW CONTROLS
 * ============================================== */

contextBridge.exposeInMainWorld("windowControls", {
    /**
     * Minimizes the window.
     *
     * @returns {void}
     */
    minimize() {
        ipcRenderer.send("window:minimize");
    },

    /**
     * Closes the window.
     *
     * @returns {void}
     */
    close() {
        ipcRenderer.send("window:close");
    },

    /**
     * Reads app-name from config.
     *
     * @returns {Promise<string>}
     */
    getAppName() {
        return ipcRenderer.invoke("window:get-app-name");
    },

    /**
     * Reads brand name + logo for the title bar.
     *
     * @returns {Promise<{ name: string, logo: string }>}
     */
    getBrand() {
        return ipcRenderer.invoke("window:get-brand");
    }
});
