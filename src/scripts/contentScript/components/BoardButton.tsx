import * as React from 'react';
import { observer } from 'mobx-react';
import { LogoIcon } from './LogoIcon';
import { BoardSettingsStore } from '../stores/BoardSettingsStore';

interface Props {
    model: BoardSettingsStore
}

@observer
export class BoardButton extends React.Component<Props, {}>
{
    
    private toggleEnabled = () => {
        this.props.model.toggleEnabled();
    }

    render() {

        var isEnabled = this.props.model.isEnabled;
        var canBeEnabled = location.href != "https://trello.com/b/H9WH4BAm/chat-for-trello";

        return <a 
            href="#"
            className="board-header-btn"
            title={canBeEnabled ? "Enable or disable Chat for Trello" : "Chat for Trello is disabled on this Board"}            
            style={canBeEnabled ? { marginRight: 10 } : { opacity: 0.5 }}
            >
                <span 
                    className="board-header-btn-icon" 
                    style={{ padding: "0px 0px 0px 2px" }}
                    onClick={canBeEnabled ? this.toggleEnabled : () => {}}>
                    <LogoIcon isOn={isEnabled} />
                </span>
            </a>
    }
}