import Checklist from './Checklist.jsx';
import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from "./Loading.jsx";

class ListChecklists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            dataReceived: false,
        }
        this.token = window.sessionStorage.getItem("token");
        this.navigation = props.navigation;
    }

    componentDidMount() {
        if (this.token == null) {
            this.navigation("/login");
        }
        const apiUrl = import.meta.env.VITE_API_BASE_URL + "checklists";
        this.setState({ loading: true });
        axios.get(apiUrl)
         .then((response) => {
            this.setState({
                data: response.data,
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
            return <Loading text={"Loading..."}/>
        }
        return (
            <div className="row p-5">
                <div className="col-4 d-none d-xxl-block">
                </div>
                <div className="col-12 col-xxl-4">
                    <Checklists data={this.state.data} dataReceived={this.state.dataReceived} />
                </div>
                <div className="col-4 d-none d-xxl-block">
                </div>
            </div>
        );
    }
}

class Checklists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            dataReceived: props.dataReceived,
        }
    }

    render() {
        if (!this.state.dataReceived) {
            return <Loading text={"Loading..."}/>
        }
        return this.state.data.checklists.map((checklist) => (
            <div key = {"checklist-" + checklist.id}>
                <Checklist data={checklist} />
            </div>
        ));
    }

}

export default function (props) {
    const navigation = useNavigate();
    return <ListChecklists navigation={navigation} />
}