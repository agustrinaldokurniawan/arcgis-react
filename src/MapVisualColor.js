import React, { useEffect } from "react";

import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";

const MapVisualColor = () => {
  useEffect(() => {
    var map = new Map({
      basemap: "gray-vector",
    });

    var view = new MapView({
      container: "root",
      map: map,
      center: [-85.0502, 33.125524], // longitude, latitude
      zoom: 5,
    });

    var trailheadsRenderer = {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url:
          "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
        width: "18px",
        height: "18px",
      },
    };
    var trailheadsLabels = {
      symbol: {
        type: "text",
        color: "#FFFFFF",
        haloColor: "#5E8D74",
        haloSize: "2px",
        font: {
          size: "12px",
          family: "Noto Sans",
          style: "italic",
          weight: "normal",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.TRL_NAME",
      },
    };

    var trailheads = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      renderer: trailheadsRenderer,
      labelingInfo: [trailheadsLabels],
    });

    const defaultSym = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [128, 128, 128, 0.2],
        width: "0.5px",
      },
    };

    const renderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: defaultSym,
      label: "U.S. County",
      visualVariables: [
        {
          type: "color",
          field: "POP_POVERTY",
          normalizationField: "TOTPOP_CY",
          legendOptions: {
            title: "% population in poverty by county",
          },
          stops: [
            {
              value: 0.1,
              color: "#FFFCD4",
              label: "<10%",
            },
            {
              value: 0.3,
              color: "#350242",
              label: ">30%",
            },
          ],
        },
      ],
    };

    const povLayer = new FeatureLayer({
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/counties_politics_poverty/FeatureServer/0",
      renderer: renderer,
      title: "Poverty in the southeast U.S.",
      popupTemplate: {
        // autocasts as new PopupTemplate()
        title: "{COUNTY}, {STATE}",
        content:
          "{POP_POVERTY} of {TOTPOP_CY} people live below the poverty line.",
        fieldInfos: [
          {
            fieldName: "POP_POVERTY",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "TOTPOP_CY",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
        ],
      },
    });

    map.layers.add(povLayer);

    view.ui.add(
      new Legend({
        view: view,
      }),
      "top-right"
    );

    var trailsRenderer = {
      type: "simple",
      symbol: {
        color: "#BA55D3",
        type: "simple-line",
        style: "solid",
      },
      visualVariables: [
        {
          type: "size",
          field: "ELEV_GAIN",
          minDataValue: 0,
          maxDataValue: 2300,
          minSize: "3px",
          maxSize: "7px",
        },
      ],
    };

    var trails = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      renderer: trailsRenderer,
      opacity: 0.75,
    });

    map.add(trails, 0);

    var bikeTrailsRenderer = {
      type: "simple",
      symbol: {
        type: "simple-line",
        style: "short-dot",
        color: "#FF91FF",
        width: "1px",
      },
    };

    var bikeTrails = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
      renderer: bikeTrailsRenderer,
      definitionExpression: "USE_BIKE = 'YES'",
    });

    map.add(bikeTrails, 1);

    function createFillSymbol(value, color) {
      return {
        value: value,
        symbol: {
          color: color,
          type: "simple-fill",
          style: "solid",
          outline: {
            style: "none",
          },
        },
        label: value,
      };
    }

    var openSpacesRenderer = {
      type: "unique-value",
      field: "TYPE",
      uniqueValueInfos: [
        createFillSymbol("Natural Areas", "#9E559C"),
        createFillSymbol("Regional Open Space", "#A7C636"),
        createFillSymbol("Local Park", "#149ECE"),
        createFillSymbol("Regional Recreation Park", "#ED5151"),
      ],
    };

    var openspaces = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
      renderer: openSpacesRenderer,
      opacity: 0.2,
    });

    map.add(openspaces, 0);
  }, []);
  return <div id="viewDiv" style={{ height: "100vh", width: "100%" }}></div>;
};

export default MapVisualColor;
