import * as React from "react";
import { observer, inject } from "mobx-react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { General } from "../pages/general/General";
import { Errors } from "../pages/errors/Errors";
import { Suggest } from "../pages/suggest/Suggest";
import { Privacy } from "../pages/privacy/Privacy";
import { Notifications } from "../pages/notifications/Notifications";
import { ILogger } from "../../lib/logging/types";
import { Logging } from "../pages/logging/Logging";
import { Premium } from "../pages/Premium/Premium";

interface Props {
    logger?: ILogger;
}

@inject("logger")
@observer
export class Router extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                <HashRouter>
                    <Switch>
                        <Route path="/general" component={General} />
                        <Route path="/logging" component={Logging} />
                        <Route path="/errors" component={Errors} />
                        <Route path="/notifications" component={Notifications} />
                        <Route path="/suggest" component={Suggest} />
                        <Route path="/privacy" component={Privacy} />
                        <Route path="/premium" component={Premium} />
                        <Route component={General} />
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}
