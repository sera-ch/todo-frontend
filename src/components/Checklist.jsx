import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// TODO: Apply class pattern
const Checklist = (props) => {

    const [checkboxesDisabled, setCheckboxesDisabled] = useState(false);
    const [completedPercent, setCompletedPercent] = useState(props.data.completed_percent);
    const [tasks, setTasks] = useState(props.data.tasks);

    const TaskList = () => {
        return tasks.map((task) => (
            <div key={task.id}>
                <div className="list-group-item" value={task.id}>
                    <>
                        <input className="form-check-input" type="checkbox" disabled={checkboxesDisabled} id={"task-select-" + task.id} defaultChecked={task.checked} onChange={e=>handleChange(e.target, task)}></input>
                        <span className={"task-name " + (task.checked ? "checked" : "unchecked")}>{task.name}</span>
                    </>
                </div>
            </div>));
    }

    const handleChange = async(target, task) => {
        task.checked = !task.checked;
        target.checked = task.checked;
        const apiUrl = "https://sick-sibby-sera-ch-dc6b17e3.koyeb.app/api/tasks/" + task.id + "/update-status";
        const request = { completed: task.checked };
        setCheckboxesDisabled(true);
        await axios.put(apiUrl, JSON.stringify(request),
        {
            headers: { 'Content-Type' : 'application/json',
                        'token':  window.sessionStorage.getItem('token')}
        }).then((response) => {
            let index = tasks.findIndex(t => t.id == task.id);
            let newTasks = tasks.slice(0, index).concat(task).concat(tasks.slice(index + 1));
            setTasks(newTasks);
            setCompletedPercent(response.data.completed_percent);
            setCheckboxesDisabled(false);
        }).catch((error) => {
            console.error(error);
            setCheckboxesDisabled(false);
        });
    }

    return (
        <>
            <div className="accordion" id={"checklist-accordion-" + props.data.id}>
                <div className="accordion-item no-border collapse-item">
                    <div className="accordion-header" id={"checklist-" + props.data.id}>
                        <h6>
                            <button className="btn btn-link accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#checklist-card-" + props.data.id} aria-expanded="true" aria-controls={"checklist-card-" + props.data.id}>
                                <span className="checklist-name">{props.data.name}</span>
                                <div className="checklist-status">
                                    <span className={"checklist-status-label " + (completedPercent == 100 ? "completed" : "in-progress")} id={"checklist-status-label-" + props.data.id}>
                                        {completedPercent == 100 ? <i className="bi bi-check"></i> : <span></span>}
                                    </span>
                                </div>
                            </button>
                        </h6>
                        <div>
                            <span className = "completed-percent ps-4">
                                {completedPercent + "% completed"}
                            </span>
                        </div>
                        <div className="progress" id={"progress-" + props.data.id}>
                            <div style={{width: completedPercent + "%"}} className = {"progress-bar w-" + completedPercent + " " + (completedPercent == 100 ? "completed" : "in-progress")} role="progressbar" aria-valuenow={completedPercent} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div id={"checklist-card-" + props.data.id} className="accordion-collapse collapse" aria-labelledby={"checklist-" + props.data.id} data-bs-parent={"#checklist-accordion-" + props.data.id}>
                        <div className="accordion-body">
                            <div className="form-check">
                                <ul className="list-group">
                                    <TaskList />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checklist;