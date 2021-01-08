import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import BasicMap from "./BasicMap";
import MapPage from "./MapPage";
import MapVisualColor from "./MapVisualColor";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={BasicMap} />
        <Route exact path="/map" component={MapPage} />
        <Route exact path="/mapColor" component={MapVisualColor} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
