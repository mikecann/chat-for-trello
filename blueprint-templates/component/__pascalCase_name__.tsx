import * as React from 'react';
import { observer, inject } from 'mobx-react';

interface Props {
    store?: SOMESTORE
}

@inject("store")
@observer
export class {{pascalCase name}} extends React.Component<Props, {}>
{
    render() {
        const store = this.props.store!;
        return <div>hello world</div>
    }
}