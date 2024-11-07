import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const navigate = useNavigate();

    const onButtonClick = async(event) => {
        event.preventDefault();
        const apiUrl = "https://sick-sibby-sera-ch-dc6b17e3.koyeb.app/api/users/login"
        setButtonDisabled(true);
        await axios.post(apiUrl,
           JSON.stringify({
               username: username,
               password: password
           }),
           {
            headers: { 'Content-Type' : 'application/json' }
           }).then((response) => {
            window.sessionStorage.setItem("token", response.data.token);
            setButtonDisabled(false);
            navigate("/")
           }).catch((error) => {
            console.error(error);
            setButtonDisabled(false);
           });
    }

    return(
        <>
            <div className="row p-5">
                <div className="col-4 d-none d-md-block">
                </div>
                <div className="col-12 col-md-4">
                    <>
                        <div className="login-form-container">
                            <div className="row">
                                LOGIN
                            </div>
                            <form className="form-control login-form">
                                <div className="row">
                                    <label htmlFor="username-input" className="col-4">Username:</label>
                                    <input type="text" id="username-input" className="username-input col-7" required onChange={event => setUsername(event.target.value)}></input>
                                </div>
                                <div className="row">
                                    <label htmlFor="password-input" className="col-4">Password:</label>
                                    <input type="password" id="password-input" className="password-input col-7" required onChange={event => setPassword(event.target.value)}></input>
                                </div>
                                <div className="login-button-container">
                                    <button className="btn login-button" disabled={buttonDisabled} onClick={event => onButtonClick(event)}>
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                </div>
                <div className="col-4 d-none d-md-block">
                </div>
            </div>
        </>
    );
}

export default Login;