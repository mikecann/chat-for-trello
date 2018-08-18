import { configure } from "@storybook/react";
import "semantic-ui-css/semantic.min.css";

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /.stories.tsx$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
