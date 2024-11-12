import { Component } from 'react';

export default class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendContent: props.sendContent,
        };
    }

    render() {
        return (
            <>
                <div className={"sidebar col-2"}>
                    <div>
                        <div className="sidebar-title">
                            <h4>
                                Admin
                            </h4>
                        </div>
                        <div>
                        <a href="" onClick={(e) => this.state.sendContent(e, 1)}>
                            <div className = "sidebar-option row">
                                <i className="bi bi-card-checklist col-3"></i>
                                <h5 className="d-none d-md-block col-9">Checklists</h5>
                            </div>
                        </a>
                        <a href="" onClick={(e) => this.state.sendContent(e, 2)}>
                            <div className="sidebar-option row">
                                <i className="bi bi-people col-3"></i>
                                <h5 className="d-none d-md-block col-9">Users</h5>
                            </div>
                        </a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}