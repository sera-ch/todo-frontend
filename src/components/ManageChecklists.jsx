import { Component } from 'react';

export default class ManageChecklists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
        this.token = window.sessionStorage.getItem("token");
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="title">
                        <h1>Manage checklists</h1>
                    </div>
                </div>
            </>
        )
    }
}