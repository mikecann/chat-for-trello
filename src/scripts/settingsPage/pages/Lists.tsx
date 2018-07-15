import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Segment, Header, Checkbox, Form, Divider } from 'semantic-ui-react';
import { Page } from '../components/Page';
import { PremiumSettingsSegment } from '../components/PremiumSettingsSegment';
import { AppSettingsModel } from '../../models/AppSettingsModel';
import { SettingsSaveButton } from '../components/SettingsSaveButton';
import { ListSettingsEditor } from '../../components/ListSettingsEditor';

interface Props {
    logger?: ILogger,
    location: Location,
    model?: AppSettingsModel
}

@inject("logger", "model")
@observer
export class Lists extends React.Component<Props, {}>
{
    render() {
        const model = this.props.model!;
        const settings = model.settings.listDefaults;
        return <Page location={this.props.location}>
            <PremiumSettingsSegment>
                <Header as="h1">
                    List Default Settings
                    <Header.Subheader>Settings that new Lists inherit</Header.Subheader>
                </Header>
                <Divider section />
                <ListSettingsEditor settings={settings} />
                <Divider section />
                <SettingsSaveButton />
            </PremiumSettingsSegment>
        </Page>
    }
}
