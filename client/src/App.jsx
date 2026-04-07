import { useState } from "react";
import InfoPanel from "./components/InfoPanel.jsx";
import ItemsPanel from "./components/ItemsPanel.jsx";

export default function App() {
  const [tab, setTab] = useState("info");

  return (
    <>
      <header>
        <h1>python-react-scaffold</h1>
        <nav>
          <button
            className={tab === "info" ? "active" : ""}
            onClick={() => setTab("info")}
          >
            Info
          </button>
          <button
            className={tab === "items" ? "active" : ""}
            onClick={() => setTab("items")}
          >
            Items
          </button>
        </nav>
      </header>
      <main>
        {tab === "info" && <InfoPanel />}
        {tab === "items" && <ItemsPanel />}
      </main>
    </>
  );
}
