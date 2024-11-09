import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManageChecklists from './ManageChecklists.jsx';
import ErrorPage from './error/ErrorPage.jsx';

const Dashboard = () => {
    const navigate = useNavigate();
    const Content = {
        manageChecklists: <ManageChecklists />
    }
    const token = window.sessionStorage.getItem("token");
    const role = window.sessionStorage.getItem("role");
    const [content, setContent] = useState(Content.manageChecklists);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataReceived, setDataReceived] = useState(false);
    useEffect(() => {
        if (token == null) {
            navigate("/login");
        }
        if (role != "ADMIN") {
            return <ErrorPage error="AuthError" />;
        }
         const apiUrl = "https://sick-sibby-sera-ch-dc6b17e3.koyeb.app/api/checklists";
         setLoading(true);
         axios.get(apiUrl)
             .then((response) => {
                 setData(response.data);
                 setDataReceived(true);
                 setLoading(false);
             })
             .catch((error) => {
                console.error(error);
                setLoading(false);
             });
        }, []);
    if(loading) {
        return "Loading";
    }
    return (
        <>
            <div>"loaded"</div>
        </>
    );
}

export default Dashboard;