import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer, inject } from "mobx-react";
import { ILogger } from "../../lib/logging/types";

interface Props {
    logger?: ILogger;
    queryEl: HTMLElement;
    querySelector: string;
    mountId: string;
    mountRef?: (el: HTMLElement) => void;
    mountElementType?: string;
    mountAsFirst?: boolean;
}

@inject("logger")
@observer
export class Portal extends React.Component<Props, any> {
    render() {
        var mountContainer = this.props.queryEl.querySelector(this.props.querySelector) as
            | HTMLElement
            | undefined;
        if (!mountContainer) {
            this.props.logger!.debug(
                `Portal cannot render. Could not find the required elemnt, selector: ${
                    this.props.querySelector
                }`
            );
            return "";
        }

        const mountId = this.props.mountId;
        let mount = mountContainer.querySelector("." + mountId);
        if (!mount) {
            var elType = this.props.mountElementType || "span";
            mount = document.createElement(elType);
            mount.classList.add(mountId);

            if (this.props.mountRef) this.props.mountRef(mount as HTMLElement);

            if (this.props.mountAsFirst)
                mountContainer.insertBefore(mount, mountContainer.firstChild);
            else mountContainer.appendChild(mount);
        }

        return ReactDOM.createPortal(this.props.children, mount);
    }
}
