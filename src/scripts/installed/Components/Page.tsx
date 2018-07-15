import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Info } from './Info';

interface Props {
    logger?: ILogger
}

@inject("logger")
@observer
export class Page extends React.Component<Props, {}>
{
    render() {
        return <div style={{ display: "flex", width: "100hw", height: "100vh", justifyContent: "center", alignItems: "center" }}>
            <Info />            
        </div>
    }
}
