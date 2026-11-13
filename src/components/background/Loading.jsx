/* ==============================================
 * IMPORTS
 * ============================================== */

import { useEffect, useState } from "react";

import "../CSS/Loading.css";

/* ==============================================
 * LOADING SCREEN
 * ============================================== */

/**
 * Basic spinner between screens.
 *
 * @param {number} [time]
 * @param {number} [fadeSpeed]
 * @param {function} [onFinish]
 * @returns {import("react").JSX.Element}
 */
export default function LoadingScreen({
  time = 1500,
  fadeSpeed = 500,
  onFinish,
}) {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  /* ==============================================
   * LOADING LIFECYCLE
   * ============================================== */

  /**
   * Show the spinner, then fade out and call onFinish.
   */
  useEffect(() => {
    const loaderTimer = requestAnimationFrame(() => {
      setIsLoaderVisible(true);
    });

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, time);

    const finishTimer = setTimeout(() => {
      if (typeof onFinish !== "function") return;

      onFinish();
    }, time + fadeSpeed);

    return () => {
      cancelAnimationFrame(loaderTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [time, fadeSpeed, onFinish]);

  const screenClassName = isFadingOut
    ? "load-screen load-screen-fade-out"
    : "load-screen";

  const loaderClassName = [
    "loader",
    isLoaderVisible ? "loader-visible" : "",
    isFadingOut ? "loader-fade-out" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={screenClassName}
      style={{ "--loading-fade-speed": `${fadeSpeed}ms` }}
      role="status"
      aria-label="Loading"
    >
      {/* Spinner */}
      <div className={loaderClassName} />
    </div>
  );
}
