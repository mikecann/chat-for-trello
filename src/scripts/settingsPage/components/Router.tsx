import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { General } from '../pages/General';
import { Logging } from '../pages/Logging';
import { Errors } from '../pages/Errors';
import { Suggest } from '../pages/Suggest';
import { Privacy } from '../pages/Privacy';
import { Premium } from '../pages/Premium';
import { Lists } from '../pages/Lists';

interface Props {
    logger?: ILogger
}

@inject("logger")
@observer
export class Router extends React.Component<Props, {}>
{
    render() {
        return <div >
            <HashRouter>
                <Switch>
                    <Route path="/general" component={General} />
                    <Route path="/lists" component={Lists} />
                    <Route path="/logging" component={Logging} />
                    <Route path="/errors" component={Errors} />
                    <Route path="/suggest" component={Suggest} />
                    <Route path="/privacy" component={Privacy} />
                    <Route path="/premium" component={Premium} />
                    <Route component={General} />
                </Switch>
            </HashRouter>
        </div>
    }
}
