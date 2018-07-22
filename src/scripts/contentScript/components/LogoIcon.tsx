import * as React from 'react';
import { observer, inject } from 'mobx-react';

interface Props {
    isOn: boolean;
}

@observer
export class LogoIcon extends React.Component<Props, any>
{
    render() {
        return <img style={{ 
            padding: "8px 6px 0px", 
            opacity: this.props.isOn ? 1 : 0.5,
            filter: this.props.isOn ? undefined : `grayscale(100%)`
         }}
        src={chrome.extension.getURL("./images/logo-16x16-inverted.png")} />
    }
}
