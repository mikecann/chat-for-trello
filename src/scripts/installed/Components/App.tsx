import * as React from "react";
import { observer, inject } from "mobx-react";
import { Page } from "./Page";
import { ILogger } from "../../lib/logging/types";

interface Props {
    logger?: ILogger;
}

@inject("logger")
@observer
export class App extends React.Component<Props, {}> {
    render() {
        return <Page />;
    }
}
