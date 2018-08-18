import * as React from "react";
import { storiesOf } from "@storybook/react";
import { World } from "./Hello";

storiesOf("Hello", module).add("Default", () => <World />);
