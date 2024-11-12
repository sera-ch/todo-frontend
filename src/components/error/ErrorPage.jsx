import { Component } from 'react';
import errorImage from '../../assets/error.png';

export default class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.error = props.error;
    }

    render() {
        return (
            <div className="row p-5">
                <div className="col-4 d-none d-md-block">
                </div>
                <div className="col-12 col-md-4 error-element">
                    <ErrorElement error={this.error} />
                </div>
                <div className="col-4 d-none d-md-block">
                </div>
            </div>
        );
    }
}

class DefaultError extends Component {
    render() {
        return (
            <>
                <h2>Unknown error!</h2>
            </>
        )
    }
}

class NotFound extends Component {
    render() {
        return (
            <>
                <h2>Page not found!</h2>
            </>
        )
    }
}

class AuthError extends Component {
    render() {
        return (
            <>
                <h2>User is not admin!</h2>
            </>
        )
    }
}

class ErrorElement extends Component {

    constructor(props) {
        super(props);
        const errorMessages = [
            {
                error: "NotFound",
                header: "Oops, wrong turn.",
                message: "This page is not found. Please check your address."
            },
            {
                error: "AuthError",
                header: "You're not supposed to be here.",
                message: "You need to be admin to access this function."
            },
            {
                error: "NotAvailable",
                header: "We are getting ready.",
                message: "Service is unavailable at the moment. Please try again later."
            },
            {
                error: "DefaultError",
                header: "Oops!",
                message: "Something went wrong. Please try again."
            },
        ];
        this.error = errorMessages.find(e => e.error == props.error);
    }

    render() {
        return (
            <>
                <div className="error-header">
                    <h2>{this.error.header}</h2>
                </div>
                <div className="error-body">
                    <img className="error-image" src={errorImage} />
                    <h4>{this.error.message}</h4>
                </div>
            </>
        );
    }
}