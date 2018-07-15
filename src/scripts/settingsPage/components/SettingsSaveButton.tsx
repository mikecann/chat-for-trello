import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppSettingsModel } from '../../models/AppSettingsModel';
import { SaveButton } from './SaveButton';

interface Props {
    model?: AppSettingsModel
}

interface State {
    shouldShowSaved: boolean;
}

@inject("model")
@observer
export class SettingsSaveButton extends React.Component<Props, State>
{
    save = () =>  {
        this.props.model!.persist();
        return true;
    }

    render() {
        const model = this.props.model!;
        return <SaveButton needsSave={model.isDirty} onSave={this.save} />
    }
}