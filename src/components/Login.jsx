import { Component } from 'react';
import axios from 'axios';
import React from "react";
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading.jsx";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false,
            from: props.from,
            token: window.sessionStorage.getItem("token"),
        }
        this.navigation = props.navigation;
        if(this.state.token != null && this.token !== "") {
            this.navigation("/");
        }
    }

    onButtonClick = async(event) => {
        event.preventDefault();
        const apiUrl = import.meta.env.VITE_API_BASE_URL +  "users/login"
        this.setState({
            buttonDisabled: true,
        });
        await axios.post(apiUrl,
           JSON.stringify({
               username: this.state.username,
               password: this.state.password,
           }),
           {
            headers: { 'Content-Type' : 'application/json' }
           }).then((response) => {
            window.sessionStorage.setItem("token", response.data.token);
            window.sessionStorage.setItem("role", response.data.role);
            window.sessionStorage.setItem("username", response.data.username);
            this.setState({
                buttonDisabled: false,
            });
            this.navigation(this.state.from || "/");
           }).catch((error) => {
            console.error(error);
            this.setState({
                buttonDisabled: false,
            });
           });
    }

    handleUsernameChange = (event) => {
        this.setState({
            username: event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    render() {
        if (this.state.buttonDisabled) {
            return <Loading text={"Logging in..."}/>
        }

        return(
            <div className="row p-5">
                <div className="col-4 d-none d-xxl-block">
                </div>
                <div className="col-12 col-xxl-4">
                    <div className="login-form-container">
                        <div className="row">
                            LOGIN
                        </div>
                        <form className="form-control login-form">
                            <div className="row">
                                <label htmlFor="username-input" className="col-4">Username:</label>
                                <input type="text" id="username-input" className="username-input col-7" required onChange={event => this.handleUsernameChange(event)}></input>
                            </div>
                            <div className="row">
                                <label htmlFor="password-input" className="col-4">Password:</label>
                                <input type="password" id="password-input" className="password-input col-7" required onChange={event => this.handlePasswordChange(event)}></input>
                            </div>
                            <div className="login-button-container">
                                <button className="btn login-button" disabled={this.state.buttonDisabled} onClick={event => this.onButtonClick(event)}>
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-4 d-none d-xxl-block">
                </div>
            </div>
        );
    }

}

export default function(props) {
    const navigation = useNavigate();
    return <Login navigation={navigation} />;
}