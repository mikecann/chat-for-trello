import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Label, Icon, Transition } from 'semantic-ui-react';

interface Props {
    onSave: () => boolean;
    needsSave: boolean
}

interface State {
    shouldShowSaved: boolean;
}

@observer
export class SaveButton extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props);
        this.state = {
            shouldShowSaved: false
        }
    }

    save = () => {
        if (!this.props.onSave())
            return;

        this.setState({ shouldShowSaved: true });
        setTimeout(() => this.setState({ shouldShowSaved: false }), 1000);        
    }

    render() {
        const { needsSave } = this.props;
        return <div>
            <Button
                disabled={!needsSave}
                primary
                onClick={this.save}>
                <Icon name={needsSave ? "save" : "save outline"} /> Save
                </Button>
            <Transition visible={this.state.shouldShowSaved} duration={{ show: 0, hide: 1000 }}>
                <Label basic color='green' pointing='left'><Icon name="checkmark" /> Saved</Label>
            </Transition>
        </div>
    }
}