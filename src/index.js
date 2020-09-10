import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import * as serviceWorker from "./serviceWorker";

import "./assets/styles/index.scss";
import Store from "./store/Store";

const rootElement = document.getElementById("root");
const render = rootElement.hasChildNodes() ? ReactDOM.hydrate : ReactDOM.render;

render(
  <Provider store={Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  rootElement
);

// serviceWorker.register();
