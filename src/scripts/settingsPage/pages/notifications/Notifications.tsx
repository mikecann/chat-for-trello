import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "../../../lib/logging/types";

interface Props {
    logger?: ILogger;
    location: Location;
}

@inject("logger")
@observer
export class Notifications extends React.Component<Props, {}> {
    render() {
        return "";
        // const model = this.props.model!;
        // const settings = model.settings.listDefaults;
        // return <Page location={this.props.location}>
        //     <PremiumSettingsSegment>
        //         <Header as="h1">
        //             Notifications Settings
        //             <Header.Subheader>Settings that new Lists inherit</Header.Subheader>
        //         </Header>
        //         <Divider section />
        //         <ListSettingsEditor settings={settings} />
        //         <Divider section />
        //         <SettingsSaveButton />
        //     </PremiumSettingsSegment>
        // </Page>
    }
}
