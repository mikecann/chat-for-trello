import * as React from 'react';
import { observer, inject } from 'mobx-react';

interface Props {
}

@observer
export class ChatWindowDragHandle extends React.Component<Props, {}>
{
    render() {
        return <div
            className="chat-window-drag-handle"
            style={{
                width: "100%",
                height: 10,
                cursor: "move"
            }}
            ></div>
    }
}