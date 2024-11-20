import {Component} from "react";
import React from 'react'
import {OrbitProgress} from "react-loading-indicators";

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text || "Loading..."
        }
    }

    render() {
        return (
            <div className={"loading-bg"}>
                <div className={"loading-icon"}>
                    <OrbitProgress dense variant={"track-disc"} color={"#e9781a"} size={"large"} text={this.state.text} textColor="" easing={"ease-in-out"}/>
                </div>
            </div>
        );
    }
}