import { Component } from 'react';

export default class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.setState({ error: props.error });
    }

    render() {
        if (error == "NotFound") {
            return <NotFound />;
        }
        if (error == "AuthError") {
            return <AuthError />;
        }
        return <DefaultError />;
    }
}

class DefaultError extends Component {
    render() {
        return (
            <>
                <div>Unknown error!</div>
            </>
        )
    }
}

class NotFound extends Component {
    render() {
        return (
            <>
                <div>Page not found!</div>
            </>
        )
    }
}

class AuthError extends Component {
    render() {
        return (
            <>
                <div>User is not admin!</div>
            </>
        )
    }
}