/* ==============================================
 * IMPORTS
 * ============================================== */

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import "../components/CSS/pages/Display.css";

/* ==============================================
 * DISPLAY
 * ============================================== */

const ease = [0.16, 1, 0.3, 1];

export default function Display() {
  const [title, setTitle] = useState("");

  /**
   * Load the app name for the home title.
   */
  useEffect(() => {
    const controls = window.windowControls;

    if (!controls?.getAppName) return;

    controls.getAppName().then((appName) => {
      const label = String(appName || "").trim();

      if (!label) return;

      setTitle(label);
    });
  }, []);

  return (
    <section className="display">
      {title ? (
        <>
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
          >
            This is the general structure used for tools made for the Integrity
            Forensics network. It is only a base structure to rely on for new
            tools in the future, and it has no other functionality besides that.
          </motion.p>
        </>
      ) : null}
    </section>
  );
}
