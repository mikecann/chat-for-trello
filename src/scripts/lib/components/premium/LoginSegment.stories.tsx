import * as React from "react";
import { storiesOf } from "@storybook/react";
import { LoginSegment } from "./LoginSegment";
import { action } from "@storybook/addon-actions";

storiesOf("LoginSegment", module)
    .add("Default", () => <LoginSegment onLogin={action("loggedIn")} />)
    .add("Loading", () => <LoginSegment isLoading={true} onLogin={action("loggedIn")} />);
