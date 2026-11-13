/* ==============================================
 * IMPORTS
 * ============================================== */

import { motion } from "motion/react";

import "../components/CSS/pages/Platforms.css";

/* ==============================================
 * PLATFORMS
 * ============================================== */

const ease = [0.16, 1, 0.3, 1];

/**
 * Platform picker on launch.
 *
 * @param {{ platforms: Array<{ name: string, enabled: boolean, icon: string }>, onSelect: function }} props
 * @returns {import("react").JSX.Element}
 */
export default function Platforms({ platforms, onSelect }) {
  return (
    <motion.section
      className="platforms"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease }}
    >
      {/* ==============================================
       * ATMOSPHERE
       * ============================================== */}

      <div className="platforms-atmosphere" aria-hidden="true">
        <div className="platforms-grid-layer" />
        <div className="platforms-glow" />
      </div>

      {/* ==============================================
       * CONTENT
       * ============================================== */}

      <div className="platforms-panel">
        <motion.div
          className="platforms-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease }}
        >
          {/* Title */}
          <h1>Select Platform</h1>

          {/* Description */}
          <p className="platforms-note">
            Choose the environment this tool will operate against.
          </p>
        </motion.div>

        <div className="platforms-grid">
          {platforms.map((platform, index) => (
            <motion.button
              key={platform.name}
              type="button"
              className="platform-card"
              disabled={!platform.enabled}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.14 + index * 0.08, ease }}
              whileHover={
                platform.enabled
                  ? { y: -4, transition: { duration: 0.4, ease } }
                  : undefined
              }
              whileTap={
                platform.enabled
                  ? { scale: 0.985, transition: { duration: 0.16, ease } }
                  : undefined
              }
              onClick={() => onSelect(platform.name)}
            >
              {/* Platform icon */}
              <img src={platform.icon} alt="" />

              {/* Platform name */}
              <span>{platform.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
