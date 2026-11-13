/* ==============================================
 * IMPORTS
 * ============================================== */

import { useEffect, useState } from "react";

import "../CSS/app/TitleBar.css";

/* ==============================================
 * TITLE BAR
 * ============================================== */

export default function TitleBar() {
  const [brand, setBrand] = useState({
    name: "",
    logo: "",
  });
  const [appName, setAppName] = useState("");

  /**
   * Pull brand + app name from Electron for the title bar.
   */
  useEffect(() => {
    const controls = window.windowControls;

    if (!controls) return;

    if (controls.getBrand) {
      controls.getBrand().then((value) => {
        if (!value?.name && !value?.logo) return;

        setBrand({
          name: value.name || "",
          logo: value.logo || "",
        });
      });
    }

    if (!controls.getAppName) return;

    controls.getAppName().then((value) => {
      const label = String(value || "").trim();

      if (!label) return;

      setAppName(label);
    });
  }, []);

  function minimizeWindow() {
    window.windowControls?.minimize();
  }

  function closeWindow() {
    window.windowControls?.close();
  }

  return (
    <header className="title-bar">
      <div className="title-bar-brand">
        {/* Brand logo */}
        {brand.logo ? (
          <img className="title-bar-logo" src={brand.logo} alt="" />
        ) : null}

        {/* Brand name */}
        <span className="title-bar-label">{brand.name}</span>
      </div>

      {/* App title */}
      <span className="title-bar-app">{appName}</span>

      <div className="title-bar-controls">
        {/* Minimize */}
        <button
          type="button"
          className="title-bar-button title-bar-button-minimize"
          aria-label="Minimize"
          onClick={minimizeWindow}
        />

        {/* Close */}
        <button
          type="button"
          className="title-bar-button title-bar-button-close"
          aria-label="Close"
          onClick={closeWindow}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
