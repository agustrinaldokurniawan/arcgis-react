import logo from "./logo.svg";
import "./App.css";

import { Map, Scene, WebMap, WebScene } from "@esri/react-arcgis";

function BasicMap() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 200 }}>
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ width: "50%" }}>
          <Map
            mapProperties={{
              basemap: "dark-gray",
            }}
            viewProperties={{ center: [-118.805, 34.027], zoom: 13 }}
          />
        </div>
        <div style={{ width: "50%" }}>
          <Scene />
        </div>
      </div>

      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ width: "50%" }}>
          <WebMap id="6627e1dd5f594160ac60f9dfc411673f" />
        </div>
        <div style={{ width: "50%" }}>
          <WebScene id="f8aa0c25485a40a1ada1e4b600522681" />
        </div>
      </div>

      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ width: "50%" }}>
          {" "}
          <Map
            class="full-screen-map"
            mapProperties={{ basemap: "satellite" }}
          />
        </div>
        <div style={{ width: "50%" }}>
          <Scene
            mapProperties={{ basemap: "satellite" }}
            viewProperties={{
              center: [-122.4443, 47.2529],
              zoom: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BasicMap;
