/* ==============================================
 * STATUS EVENT
 * ============================================== */

const STATUS_EVENT = "if:status";

const VALID_TYPES = new Set([
  "success",
  "error",
  "information",
  "warn",
]);

/**
 * Pushes a status notice to the UI.
 *
 * Types:
 * success | error | information | warn
 *
 * @param {"success" | "error" | "information" | "warn"} type
 * @param {string} message
 * @param {{ duration?: number }} [options]
 * @returns {void}
 */
export function sendStatus(type, message, options = {}) {
  const statusType = String(type || "").trim().toLowerCase();
  const text = String(message || "").trim();

  if (!VALID_TYPES.has(statusType)) return;
  if (!text) return;

  const duration = Number(options.duration);

  window.dispatchEvent(
    new CustomEvent(STATUS_EVENT, {
      detail: {
        type: statusType,
        message: text,
        duration: Number.isFinite(duration) && duration > 0
          ? duration
          : 4200,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    }),
  );
}

/**
 * Listens for status notices.
 *
 * @param {(status: { id: string, type: string, message: string, duration: number }) => void} callback
 * @returns {() => void}
 */
export function onStatus(callback) {
  if (typeof callback !== "function") {
    return () => {};
  }

  const handler = (event) => {
    callback(event.detail);
  };

  window.addEventListener(STATUS_EVENT, handler);

  return () => {
    window.removeEventListener(STATUS_EVENT, handler);
  };
}
