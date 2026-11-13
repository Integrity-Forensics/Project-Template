/* ==============================================
 * IMPORTS
 * ============================================== */

import { useCallback, useState } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence } from "motion/react";

import "../components/CSS/Root.css";
import appConfig from "../../configuration/api/config.json";

import TitleBar from "../components/ui/TitleBar.jsx";
import StatusNotice from "../components/ui/StatusNotice.jsx";
import LoadingScreen from "../components/background/Loading.jsx";
import Platforms from "../pages/Platforms.jsx";
import Display from "../pages/Display.jsx";
import { sendStatus } from "../../utils/sendStatus.js";

/* ==============================================
 * PLATFORMS
 * ============================================== */

const platformsMenu = appConfig["platforms-menu"] === true;

const platforms = Object.entries(appConfig.platforms || {}).map(
  ([name, enabled]) => ({
    name,
    enabled: enabled === true,
    icon: `./platforms/${name}.png`,
  }),
);

/* ==============================================
 * APPLICATION
 * ============================================== */

function Application() {
  const [screen, setScreen] = useState("loading");
  const [nextScreen, setNextScreen] = useState(
    platformsMenu ? "platforms" : "home",
  );

  const finishLoading = useCallback(() => {
    setScreen(nextScreen);
  }, [nextScreen]);

  return (
    <div className="app-shell">
      {/* Title bar */}
      <TitleBar />

      <main className="app-content">
        {/* Status notice */}
        <StatusNotice />

        <AnimatePresence mode="wait">
          {/* Platforms menu */}
          {screen === "platforms" ? (
            <Platforms
              key="platforms"
              platforms={platforms}
              onSelect={(name) => {
                sendStatus("success", `Successfully selected: ${name}`);
                setNextScreen("home");
                setScreen("loading");
              }}
            />
          ) : null}

          {/* Loading screen */}
          {screen === "loading" ? (
            <LoadingScreen key={nextScreen} onFinish={finishLoading} />
          ) : null}

          {/* Home display */}
          {screen === "home" ? <Display key="home" /> : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ==============================================
 * INITIALIZATION
 * ============================================== */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
