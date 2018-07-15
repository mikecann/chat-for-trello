import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';

interface Props {
    logger?: ILogger
}

@inject("logger")
@observer
export class Template extends React.Component<Props, any>
{
    render() {
        return <div />
    }
}
