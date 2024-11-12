import { Component } from 'react';

export default class ManageUsers extends Component {
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
                <div className={"manage-users col-10"}>
                    "Manage users"
                </div>
            </>
        )
    }
}