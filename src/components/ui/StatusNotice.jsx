/* ==============================================
 * IMPORTS
 * ============================================== */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
} from "lucide-react";

import { onStatus } from "../../../utils/sendStatus.js";
import "../CSS/StatusNotice.css";

/* ==============================================
 * STATUS NOTICE
 * ============================================== */

const ease = [0.16, 1, 0.3, 1];

const STATUS_ICONS = {
  success: CircleCheck,
  information: Info,
  warn: CircleAlert,
  error: CircleX,
};

/**
 * Listens for sendStatus() and shows the notice.
 *
 * @returns {import("react").JSX.Element}
 */
export default function StatusNotice() {
  const [status, setStatus] = useState(null);

  /**
   * Subscribe to status events from sendStatus().
   */
  useEffect(() => {
    return onStatus((nextStatus) => {
      setStatus(nextStatus);
    });
  }, []);

  /**
   * Auto-hide the notice after its duration.
   */
  useEffect(() => {
    if (!status) return;

    const timer = setTimeout(() => {
      setStatus((current) => {
        if (!current || current.id !== status.id) return current;

        return null;
      });
    }, status.duration);

    return () => {
      clearTimeout(timer);
    };
  }, [status]);

  const Icon = status ? STATUS_ICONS[status.type] : null;

  return (
    <AnimatePresence>
      {status && Icon ? (
        <motion.div
          key={status.id}
          className={`status-notice status-notice-${status.type}`}
          role="alert"
          initial={{ opacity: 0, x: "110%" }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              x: { duration: 0.5, ease },
              opacity: { duration: 0.2, ease: "easeOut" },
            },
          }}
          exit={{
            opacity: 0,
            x: "110%",
            transition: {
              x: { duration: 0.5, ease },
              opacity: { duration: 0.18, delay: 0.32, ease: "easeOut" },
            },
          }}
        >
          {/* Status icon */}
          <Icon aria-hidden="true" strokeWidth={2} />

          {/* Status message */}
          <p>{status.message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
