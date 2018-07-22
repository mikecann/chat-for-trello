import * as React from "react";
import { observer, inject } from "mobx-react";
import { Sidebar } from "./Sidebar";
import { ErrorModal } from "./ErrorModal";

interface Props {
    location: Location;
}

@inject("logger")
@observer
export class Page extends React.Component<Props, {}> {
    render() {
        return (
            <div style={{ height: "100vh" }}>
                <div
                    style={{
                        width: 300,
                        height: "100vh",
                        backgroundColor: "#007ac0",
                        position: "fixed",
                        color: "white",
                        padding: 10
                    }}
                >
                    <Sidebar location={this.props.location} />
                </div>
                <div
                    style={{
                        width: "100hw",
                        minHeight: "100vh",
                        padding: 20,
                        marginLeft: 300,
                        backgroundColor: "rgba(0,0,0,.05)"
                    }}
                >
                    <div style={{ maxWidth: 800 }}>{this.props.children}</div>
                </div>
                <ErrorModal />
            </div>
        );
    }
}
