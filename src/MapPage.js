import React, { useEffect } from "react";

import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";
import Editor from "@arcgis/core/widgets/Editor";

const MapPage = () => {
  useEffect(() => {
    var map = new Map({
      basemap: "topo-vector",
    });

    var view = new MapView({
      container: "root",
      map: map,
      center: [106.77052, -6.14944], // longitude, latitude
      zoom: 13,
    });

    var basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "satellite",
    });

    view.ui.add(basemapToggle, "bottom-right");

    var basemapGallery = new BasemapGallery({
      view: view,
      source: {
        portal: {
          url: "https://www.arcgis.com",
          useVectorBasemaps: true, // Load vector tile basemaps
        },
      },
    });

    view.ui.add(basemapGallery, "top-right");

    var trailheadsLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    });

    map.add(trailheadsLayer);

    // Trails feature layer (lines)
    var trailsLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
    });

    map.add(trailsLayer, 0);

    // Parks and open spaces (polygons)
    var parksLayer = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
    });

    map.add(parksLayer, 0);

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

    map.add(trailheads);

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

    var popupTrailheads = {
      title: "{TRL_NAME}",
      content:
        "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft",
    };

    var trailheads = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
      outFields: ["TRL_NAME", "CITY_JUR", "X_STREET", "PARKING", "ELEV_FT"],
      popupTemplate: popupTrailheads,
    });

    map.add(trailheads);

    var popupTrails = {
      title: "Trail Information",
      content: function () {
        return "This is {TRL_NAME} with {ELEV_GAIN} ft of climbing.";
      },
    };

    var trails = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
      outFields: ["TRL_NAME", "ELEV_GAIN"],
      popupTemplate: popupTrails,
    });

    map.add(trails, 0);

    var popupOpenspaces = {
      title: "{PARK_NAME}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "AGNCY_NAME",
              label: "Agency",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },
            {
              fieldName: "TYPE",
              label: "Type",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },
            {
              fieldName: "ACCESS_TYP",
              label: "Access",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: null,
              stringFieldOption: "text-box",
            },
            {
              fieldName: "GIS_ACRES",
              label: "Acres",
              isEditable: true,
              tooltip: "",
              visible: true,
              format: {
                places: 2,
                digitSeparator: true,
              },
              stringFieldOption: "text-box",
            },
          ],
        },
      ],
    };

    var openspaces = new FeatureLayer({
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
      outFields: ["TYPE", "PARK_NAME", "AGNCY_NAME", "ACCESS_TYP", "GIS_ACRES"],
      popupTemplate: popupOpenspaces,
    });

    map.add(openspaces, 0);

    // Search widget
    var search = new Search({
      view: view,
    });

    view.ui.add(search, "top-right");

    view.on("click", function (evt) {
      search.clear();
      view.popup.clear();
      if (search.activeSource) {
        var geocoder = search.activeSource.locator; // World geocode service
        var params = {
          location: evt.mapPoint,
        };
        geocoder.locationToAddress(params).then(
          function (response) {
            // Show the address found
            var address = response.address;
            showPopup(address, evt.mapPoint);
          },
          function (err) {
            // Show no address found
            showPopup("No address found.", evt.mapPoint);
          }
        );
      }
    });

    //*** ADD ***//
    var myPointsFeatureLayer = new FeatureLayer({
      //*** Replace with your URL ***//
      url:
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/my_points/FeatureServer",
    });

    map.layers.add(myPointsFeatureLayer);

    function showPopup(address, pt) {
      view.popup.open({
        title:
          +Math.round(pt.longitude * 100000) / 100000 +
          "," +
          Math.round(pt.latitude * 100000) / 100000,
        content: address,
        location: pt,
      });
    }

    var editorWidget = new Editor({
      view: view,
    });

    view.ui.add(editorWidget, "bottom-left");
  }, []);

  return <div id="viewDiv" style={{ height: "100vh", width: "100%" }}></div>;
};

export default MapPage;
