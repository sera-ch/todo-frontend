import { Component } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManageChecklists from './ManageChecklists.jsx';
import ManageUsers from './ManageUsers.jsx';
import AdminSidebar from './AdminSidebar.jsx';
import ErrorPage from './error/ErrorPage.jsx';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 1,
            checklists: [],
            users: [],
            loading: false,
            dataReceived: false,
            navigation: props.navigation,
        };
        this.token = window.sessionStorage.getItem("token");
        this.role = window.sessionStorage.getItem("role");
    }

    setContent = (event, contentId) => {
        event.preventDefault();
        this.setState({
            content: contentId,
        });
    }

    componentDidMount() {
        if (this.token == null) {
            this.state.navigation("/login");
        }
        if (this.role != "ADMIN") {
            return <ErrorPage error="AuthError" />;
        }
        const checklistsApiUrl = "https://sick-sibby-sera-ch-dc6b17e3.koyeb.app/api/checklists";
        this.setState({ loading: true });
        axios.get(checklistsApiUrl)
         .then((response) => {
            this.setState({
                checklists: response.data,
                dataReceived: true,
                loading: false,
            });
         })
         .catch((error) => {
            console.error(error);
            this.setState({
                loading: false,
            });
         });
    }

    render() {
        if(this.state.loading) {
            return "Loading";
        }
        if (this.state.content == 1) {
            return(
                <div className="row">
                    <div className="col-2">
                        <AdminSidebar sendContent={this.setContent} />
                    </div>
                    <div className="col-10">
                        <ManageChecklists data={this.state.checklists} />
                    </div>
                </div>
            );
        }
        if (this.state.content == 2) {
            return(
                <div className="row">
                    <div className="col-2">
                        <AdminSidebar sendContent={this.setContent} />
                    </div>
                    <div className="col-10">
                        <ManageUsers data={this.state.users} />
                    </div>
                </div>
            );
        }
        return (
            <>
                <div>"loaded"</div>
            </>
        );
    }
}

export default function (props) {
    const navigation = useNavigate();
    return <Dashboard navigation={navigation} />
}