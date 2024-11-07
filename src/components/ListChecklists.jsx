import Checklist from './Checklist.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListChecklists = () => {
    const navigate = useNavigate();
    const token = window.sessionStorage.getItem("token");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataReceived, setDataReceived] = useState(false);
    if(token == null) {
        navigate("/login");
    }

    useEffect(() => {
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

    const Checklists = (data, index) => {
        if (!dataReceived) {
            return "No data";
        }
        return data.checklists.map((checklist, index) => (
            <div key={index}>
                <Checklist data={checklist} />
            </div>
        ));
    }

    const onButtonClick = (event) => {
//         TODO: Use modal to create new checklist
    }

    return (
        <>
            <div className="row p-5">
                <div className="col-4 d-none d-md-block">
                </div>
                <div className="col-12 col-md-4">
                    {Checklists(data)}
                    <div className="new-checklist-button-container">
                        <button className="btn new-checklist-button" id="new-checklist-button" onClick={event => onButtonClick(event)}>Add</button>
                    </div>
                </div>
                <div className="col-4 d-none d-md-block">
                </div>
            </div>
        </>
    );
}

export default ListChecklists;