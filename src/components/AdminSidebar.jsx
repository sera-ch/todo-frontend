import { Component } from 'react';
import React from "react";

export default class AdminSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendContent: props.sendContent,
            username: props.username,
        };
    }

    render() {
        return (
            <div className={"sidebar col-2"}>
                <div>
                    <div className="sidebar-title">
                        <h4 className={"d-none d-xxl-block"}>
                            {this.state.username || ""}
                        </h4>
                        <h4 className={"admin-icon d-block d-xxl-none"}>
                            <i className="bi bi-person-circle"></i>
                        </h4>
                    </div>
                    <div>
                    <a href="" onClick={(e) => this.state.sendContent(e, 1)}>
                            <div className="sidebar-option row">
                                <i className="bi bi-calendar-check col-3"></i>
                                <h5 className="d-none d-xxl-block col-9">Checklists</h5>
                            </div>
                        </a>
                        <a href="" onClick={(e) => this.state.sendContent(e, 2)}>
                            <div className="sidebar-option row">
                                <i className="bi bi-card-checklist col-3"></i>
                                <h5 className="d-none d-xxl-block col-9">Tasks</h5>
                            </div>
                        </a>
                        <a href="" onClick={(e) => this.state.sendContent(e, 3)}>
                            <div className="sidebar-option row">
                                <i className="bi bi-people col-3"></i>
                                <h5 className="d-none d-xxl-block col-9">Users</h5>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}