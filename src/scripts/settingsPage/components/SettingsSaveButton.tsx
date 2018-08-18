import * as React from "react";
import { observer, inject } from "mobx-react";
import { SaveButton } from "./SaveButton";
import { AppSettings } from "../../common/config";
import { AppSettingsStore } from "../../lib/settings/AppSettingsStore";

interface Props {
    settings?: AppSettingsStore<AppSettings>;
}

interface State {
    shouldShowSaved: boolean;
}

@inject("settings")
@observer
export class SettingsSaveButton extends React.Component<Props, State> {
    save = () => {
        this.props.settings!.commit();
        return true;
    };

    render() {
        const model = this.props.settings!;
        return <SaveButton needsSave={model.isDirty} onSave={this.save} />;
    }
}
