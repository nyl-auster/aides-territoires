import { configure } from "@storybook/react";
import "bulma/css/bulma.css";
import "../src/components/layouts/Layout.css";

const req = require.context("../src/stories", true, /stories\.js$/);
function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
