import { useState } from 'react';

const Checklist = (props) => {

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [dataReceived, setDataReceived] = useState(false);

    const TaskList = () => {
        return props.data.tasks.map((task, index) => (
            <div key={index}>
                <li className="list-group-item" value={task.id}>
                    <>
                        <input className="form-check-input" type="checkbox" id={"task-select-" + task.id} defaultChecked={task.checked} onChange={e=>handleChange(e.target, task)}></input>
                        <span className={task.checked ? "checked" : "unchecked"}>{task.name}</span>
                    </>
                </li>
            </div>));
    }

    const handleChange = (target, task) => {
        task.checked = !task.checked;
        target.checked = task.checked;
        setButtonDisabled(false);
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
                                    <span className={"checklist-status-label " + (props.data.completed_percent == 100 ? "completed" : "in-progress")} id={"checklist-status-label-" + props.data.id}>
                                        {props.data.completed_percent == 100 ? "COMPLETED" : "IN PROGRESS"}
                                    </span>
                                </div>
                            </button>
                        </h6>
                        <div>
                            <span className = "completed-percent ps-4">
                                {props.data.completed_percent + "% completed"}
                            </span>
                        </div>
                        <div className="progress" id={"progress-" + props.data.id}>
                            <div className = {"progress-bar w-" + props.data.completed_percent + " " + (props.data.completed_percent == 100 ? "completed" : "in-progress")} role="progressbar" aria-valuenow={props.data.completed_percent} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div id={"checklist-card-" + props.data.id} className="accordion-collapse collapse" aria-labelledby={"checklist-" + props.data.id} data-bs-parent={"#checklist-accordion-" + props.data.id}>
                        <div className="accordion-body">
                            <div className="form-check">
                                <ul className="list-group">
                                    <TaskList />
                                </ul>
                            </div>
                            <div className="save-button-container">
                                <button className="btn save-button" disabled={buttonDisabled} id={"save-button-" + props.data.id}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checklist;