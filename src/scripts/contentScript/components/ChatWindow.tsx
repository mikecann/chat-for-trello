import * as React from 'react';
import { observer } from 'mobx-react';
import { ChatStore } from '../stores/ChatStore';

interface Props {
    store: ChatStore
}

@observer
export class ChatWindow extends React.Component<Props, {}>
{
    render() {
        const store = this.props.store;
        return <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 1000
            }}
        >
            hello world {store.history.length}
        </div>
    }
}