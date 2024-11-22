import { Component } from 'react';
import axios from 'axios';

export default class Checklist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkboxesDisabled: false,
            completedPercent: props.data.completed_percent,
            tasks: props.data.tasks,
            checklist: props.data,
            sendChecklistsUpdate: props.sendChecklistsUpdate,
        };
    }

    setCompletedPercent = (value) => {
        this.setState({ completedPercent: value });
    }

    favoriteChecklist = async(event, checklist) => {
        event.preventDefault();
        const editChecklistApi = import.meta.env.VITE_API_BASE_URL + "checklists/" + checklist.id + "/favorite";
        this.setState({
            inputDisabled: true
        });
        let requestBody = {
            is_favorite: !checklist.is_favorite,
        };
        await axios.put(editChecklistApi,
            requestBody,
            {
                headers: { 'Content-Type' : 'application/json' }
            })
            .then((response) => {
                this.setState({
                    checklist: response.data,
                    inputDisabled: false,
                });
                this.state.sendChecklistsUpdate(checklist);
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    inputDisabled: false,
                });
            });
    }

    render() {
        return (
            <div className="accordion" id={"checklist-accordion-" + this.state.checklist.id}>
                <div className="accordion-item no-border collapse-item">
                    <div className="accordion-header" id={"checklist-" + this.state.checklist.id}>
                        <h6 style={{display: "inline-flex"}} className={"col-12"}>
                            <a href={""} className={"favorite-button col-1"}
                               onClick={(event) => this.favoriteChecklist(event, this.state.checklist)}>
                                <i className={this.state.checklist.is_favorite ? "bi bi-star-fill" : "bi bi-star"}></i>
                            </a>
                            <button className="btn btn-link accordion-button col-11 row" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={"#checklist-card-" + this.state.checklist.id} aria-expanded="true"
                                    aria-controls={"checklist-card-" + this.state.checklist.id}>
                                <div className="checklist-name col-8">{this.state.checklist.name}</div>
                                <div className="checklist-status col-2">
                                    <span
                                        className={"checklist-status-label " + (this.state.completedPercent == 100 ? "completed" : "in-progress")}
                                        id={"checklist-status-label-" + this.state.checklist.id}>
                                        {this.state.completedPercent == 100 ? <i className="bi bi-check"></i> :
                                            <span></span>}
                                    </span>
                                </div>
                            </button>
                        </h6>
                        <div>
                            <span className="completed-percent ps-4">
                                {this.state.completedPercent + "% completed"}
                            </span>
                        </div>
                        <div className="progress" id={"progress-" + this.state.checklist.id}>
                            <div style={{width: this.state.completedPercent + "%"}} className = {"progress-bar w-" + this.state.completedPercent + " " + (this.state.completedPercent == 100 ? "completed" : "in-progress")} role="progressbar" aria-valuenow={this.state.completedPercent} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div id={"checklist-card-" + this.state.checklist.id} className="accordion-collapse collapse" aria-labelledby={"checklist-" + this.state.checklist.id} data-bs-parent={"#checklist-accordion-" + this.state.checklist.id}>
                        <div className="accordion-body">
                            <div className="form-check">
                                <ul className="list-group">
                                    <TaskList checkboxesDisabled={this.state.checkboxesDisabled} tasks={this.state.tasks} sendCompletedPercent={this.setCompletedPercent} />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkboxesDisabled: props.checkboxesDisabled,
            tasks: props.tasks,
            sendCompletedPercent: props.sendCompletedPercent,
        }
    }

    handleChange = async(target, task) => {
        task.checked = !task.checked;
        target.checked = task.checked;
        const apiUrl = import.meta.env.VITE_API_BASE_URL +  "tasks/" + task.id + "/update-status";
        const request = { completed: task.checked };
        this.setState({ checkboxesDisabled: true });
        await axios.put(apiUrl, JSON.stringify(request),
        {
            headers: { 'Content-Type' : 'application/json',
                        'token':  window.sessionStorage.getItem('token')}
        }).then((response) => {
            let index = this.state.tasks.findIndex(t => t.id === task.id);
            let newTasks;
            newTasks = this.state.tasks.slice(0, index).concat(task).concat(this.state.tasks.slice(index + 1));
            this.setState({
                tasks: newTasks,
                checkboxesDisabled: false,
            });
            this.state.sendCompletedPercent(response.data.completed_percent);
        }).catch((error) => {
            console.error(error);
            task.checked = !task.checked;
            target.checked = task.checked;
            this.setState({ checkboxesDisabled: false });
        });
    }

    render() {
        return this.state.tasks.map((task) => (
        <div key={task.id}>
            <div className="list-group-item" value={task.id}>
                <input className="form-check-input" type="checkbox" disabled={this.state.checkboxesDisabled} id={"task-select-" + task.id} defaultChecked={task.checked} onChange={e=>this.handleChange(e.target, task)}></input>
                <span className={"task-name " + (task.checked ? "checked" : "unchecked")}>{task.name}</span>
            </div>
        </div>));
    }
}