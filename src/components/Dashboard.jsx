import { Component } from 'react';
import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loading from "./Loading.jsx";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 1,
            checklists: [],
            users: [],
            username: window.sessionStorage.getItem("username"),
            categories: [],
            loading: false,
            dataReceived: false,
            checklistCategory: "none",
            checklistName: "",
            checklistCategories: [],
            inputDisabled: false,
            navigation: props.navigation,
            showDeleteModal: false,
            selectedChecklist: null,
            newChecklistName: "",
            newCategory: "",
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

    async componentDidMount() {
        if (this.token == null) {
            this.navigation("/login", { from: "/admin" });
        }
        if (this.role !== "ADMIN") {
            this.navigation("/error", { error: "AuthError" });
        }
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const checklistsApiUrl = apiBaseUrl + "checklists";
        const categoriesUrl = apiBaseUrl + "tasks/categories";
        const checklistCategoriesUrl = apiBaseUrl + "checklists/categories";
        const usersUrl = apiBaseUrl + "users";
        this.setState({ loading: true });
        await axios.get(checklistsApiUrl)
            .then((response) => {
                this.setState({
                    checklists: response.data.checklists,
                    selectedChecklist: response.data.checklists[0],
                });
            }).then(() => axios.get(categoriesUrl))
            .then((response) => {
                this.setState({
                    categories: response.data,
                });
            }).then(() => axios.get(checklistCategoriesUrl))
            .then((response) => this.setState({
                checklistCategories: response.data,
                loading: false,
                dataReceived: true,
            }))
            .then(() => axios.get(usersUrl, {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            }))
            .then((response) => this.setState({
                users: response.data.users,
            }))
            .catch((error) => {
                console.error(error);
            });
    }

    handleDelete = async(event, checklist) => {
        event.preventDefault();
        const deleteChecklistApi = import.meta.env.VITE_API_BASE_URL +  "checklists/" + checklist.id;
        this.setState({
            inputDisabled: true,
            showDeleteModal: false,
        });
        await axios.delete(deleteChecklistApi,
            {
            headers: { 'Content-Type' : 'application/json',
                'token': window.sessionStorage.getItem('token')}
            })
            .then((response) => {
                if (response.data === true) {
                    let {checklists} = this.state;
                    let deletedIndex = checklists.findIndex(cl => cl.id === checklist.id);
                    this.setState({
                        checklists: checklists.slice(0, deletedIndex).concat(checklists.slice(deletedIndex + 1)),
                    });
                }
                this.setState({
                    inputDisabled: false,
                });
            }).catch((error) => {
                console.error(error);
                this.setState({
                    inputDisabled: false,
                });
            });
    }

    handleEdit = async(event, checklist) => {
        event.preventDefault();
        const editChecklistApi = import.meta.env.VITE_API_BASE_URL + "checklists/" + checklist.id;
        if (checklist.name === this.state.newChecklistName && checklist.category === this.state.newCategory) {
            return;
        }
        this.setState({
            inputDisabled: true,
            showEditModal: false,
        });
        let requestBody = {
            checklist_id: checklist.id,
            name: this.state.newChecklistName,
            category: this.state.newCategory,
        }
        await axios.put(editChecklistApi,
            requestBody,
            {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            })
            .then((response) => {
                let {checklists} = this.state;
                let updatedIndex = checklists.findIndex(cl => cl.id === checklist.id);
                this.setState({checklists: checklists.slice(0, updatedIndex).concat(response.data).concat(checklists.slice(updatedIndex + 1))});
                this.setState({
                    inputDisabled: false,
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    inputDisabled: false,
                });
            });
    }

    handleChecklistNameChange = (event) => {
        event.preventDefault();
        this.setState({
            checklistName: event.target.value,
        })
    }

    handleChecklistCategoryChange = (event) => {
        event.preventDefault();
        this.setState({
            checklistCategory: event.target.value,
        })
    }

    handleClick = async(event) => {
        event.preventDefault();
        if(this.state.checklistName === '' || this.state.checklistCategory === 'none') {
            return;
        }
        let addChecklistRequest = {
            name: this.state.checklistName,
            category: this.state.checklistCategory,
            tasks: [],
        };
        this.setState({
            inputDisabled: true,
        });
        const apiUrl = import.meta.env.VITE_API_BASE_URL +  "checklists/create";
        await axios.post(apiUrl,
            JSON.stringify(addChecklistRequest),
            {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            }).then((response) => {
            let {checklists} = this.state;
            checklists.push(response.data);
            this.setState({
                inputDisabled: false,
                checklists: checklists,
            });
        }).catch((error) => {
            console.error(error);
            this.setState({
                inputDisabled: false,
            });
        });
    }

    handleClose = () => {
        this.setState({
            showDeleteModal: false,
            showEditModal: false,
        });
    }

    showDeleteModal = (event, checklist) => {
        event.preventDefault();
        if(this.state.inputDisabled) {
            return;
        }
        this.setState({
            selectedChecklist: checklist,
            showDeleteModal: true,
        });
    }

    showEditModal = (event, checklist) => {
        event.preventDefault();
        if(this.state.inputDisabled) {
            return;
        }
        this.setState({
            selectedChecklist: checklist,
            showEditModal: true,
            newChecklistName: checklist.name,
            newCategory: checklist.category,
        });
    }

    render() {
        if (!this.state.dataReceived) {
            return <Loading text={"Loading..."}/>
        }
        if (this.state.content === 1) {
            return(
                <>
                    <Modal backdropClassName={"edit-modal-bg"} show={this.state.showDeleteModal} onHide={ this.handleClose} centered>
                        <Modal.Header className={"edit-modal"} closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={"edit-modal"}>
                            <p>{"Are you sure to delete checklist \"" + (this.state.selectedChecklist ? this.state.selectedChecklist.name : "") + "\"?"}</p>
                        </Modal.Body>
                        <Modal.Footer className={"edit-modal"}>
                            <Button variant="primary" onClick={this.handleClose}>No</Button>
                            <Button variant="secondary" onClick={(event) => this.handleDelete(event, this.state.selectedChecklist)}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal backdropClassName={"edit-modal-bg"} show={this.state.showEditModal} onHide={this.handleClose} centered>
                        <Modal.Header className={"edit-modal"} closeButton>
                            <Modal.Title>Edit checklist</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={"edit-modal row"}>
                            <div className={"col-8"}>
                                <input type={"text"} className={"edit-checklist-input"} id={"edit-checklist-name"} defaultValue={this.state.selectedChecklist ? this.state.selectedChecklist.name : ""}
                                       onChange={(event) => this.setState({newChecklistName: event.target.value})}/>
                            </div>
                            <div className={"col-4"}>
                                <select name={"categories"} disabled={this.state.inputDisabled} defaultValue={this.state.selectedChecklist? this.state.selectedChecklist.category : "none"}
                                        onChange={(event) => this.setState({newCategory: event.target.value})}>
                                    {
                                        this.state.checklistCategories.map((category) => (
                                            <option key={category + "-edit-" + this.state.checklist_id}
                                                    value={category}>{category}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className={"edit-modal"}>
                            <Button variant="primary"
                                    onClick={(event) => this.handleEdit(event, this.state.selectedChecklist)}>Save</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="row">
                        <div className="col-2">
                            <AdminSidebar username={this.state.username} sendContent={this.setContent}/>
                        </div>
                        <div className="col-10">
                            <div className={"manage-checklists row"}>
                                <div className="title">
                                    <h1>Manage checklists</h1>
                                </div>
                                <div className={"checklist-table col-1"}>ID</div>
                                <div className={"checklist-table col-8"}>Name</div>
                                <div className={"checklist-table col-2"}>Category</div>
                                <div className={"checklist-table col-1"}>Action</div>
                            </div>
                            <div className={"manage-checklists row"}>
                                {
                                    this.state.checklists.map((checklist) => (
                                        <div className={"row checklist-table checklist-item"}
                                             key={"admin-checklist-" + checklist.id}>
                                            <div className={"col-1"}>{checklist.id}</div>
                                            <div className={"col-8"}>{checklist.name}</div>
                                            <div className={"col-2 checklist-category"}><span className={"checklist-category-label label-" + checklist.category.toLowerCase()}>{checklist.category}</span></div>
                                            <div className={"col-1"}>
                                                <a href={""} className={"edit-link"} onClick={(event) => this.showEditModal(event, checklist)}>
                                                    <i className={"bi bi-pencil-fill " + (this.state.inputDisabled ? "disabled" : "")}></i>
                                                </a>
                                                <a href={""} className={"edit-link"} onClick={(event) => this.showDeleteModal(event, checklist)}>
                                                    <i className={"bi bi-x-lg " + (this.state.inputDisabled ? "disabled" : "")}></i>
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={"manage-checklists row"}>
                                <div className={"col-1"}></div>
                                <div className={"col-8"}>
                                    <input type={"text"} className={"add-new-checklist-input"}
                                           disabled={this.state.inputDisabled}
                                           onChange={(event) => this.handleChecklistNameChange(event)}/>
                                </div>
                                <div className={"col-2 checklist-category"}>
                                    <select className={"checklist-category-input"} defaultValue={"none"}
                                            disabled={this.state.inputDisabled}
                                            onChange={(event) => this.handleChecklistCategoryChange(event)}>
                                        <option disabled value={"none"}>None</option>
                                        {
                                            this.state.checklistCategories.map((category) => (
                                                <option key={"checklist-category-" + category}
                                                        value={category.toString()}>{category}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className={"col-1"}>
                                    <button className={"btn btn-primary add-new-task-button"}
                                            disabled={this.state.inputDisabled}
                                            onClick={(event) => this.handleClick(event)}>Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        if (this.state.content === 2) {
            return (
                <div className="row">
                    <div className="col-2">
                        <AdminSidebar username={this.state.username} sendContent={this.setContent}/>
                    </div>
                    <div className="col-10">
                        <div className="manage-checklists row">
                            <div className="title">
                                <h1>Manage tasks</h1>
                            </div>
                            <div className={"admin-checklist-table"}>
                                <Checklists categories={this.state.categories} checklists={this.state.checklists} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.content === 3) {
            return (
                <div className="row">
                    <div className="col-2">
                        <AdminSidebar username={this.state.username} sendContent={this.setContent}/>
                    </div>
                    <div className="col-10">
                        <div className="manage-checklists row">
                            <div className="title">
                                <h1>Manage users</h1>
                            </div>
                            <div className={"admin-checklist-table"}>
                                <UserList users={this.state.users} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>"loaded"</div>
        );
    }
}

class Checklists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklists: props.checklists,
            categories: props.categories,
        };
    }

    render() {
        return (
            <>
                <div className={"row"}>
                    <div className={"checklist-table col-1"}>ID</div>
                    <div className={"checklist-table col-9"}>Checklist name</div>
                    <div className={"checklist-table col-1"}></div>
                </div>
                {
                    this.state.checklists.map((checklist) => (
                        <div className={"row checklist-table checklist-item"} key={"admin-checklist-" + checklist.id}>
                            <div className={"col-1"}>{checklist.id}</div>
                            <div className={"col-9"}>{checklist.name}</div>
                            <div className={"col-1"}>
                                <button className={"btn"} data-bs-toggle="collapse" data-bs-target={"#task-table-" + checklist.id}>
                                    <i className="bi bi-chevron-expand"></i>
                                </button>
                            </div>
                            <TaskList categories={this.state.categories} checklist={checklist} />
                        </div>
                    ))
                }
            </>
        );
    }
}

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklist: props.checklist,
            tasks: props.checklist.tasks,
            categories: props.categories,
            showDeleteModal: false,
            showEditModal: false,
            selectedTask: null,
            inputDisabled: false,
            newTaskName: "",
            newCategory: "",
        };
    }

    showDeleteModal = (event, task) => {
        event.preventDefault();
        if(this.state.inputDisabled) {
            return;
        }
        this.setState({
            showDeleteModal: true,
            selectedTask: task,
        })
    }

    showEditModal = (event, task) => {
        event.preventDefault();
        if(this.state.inputDisabled) {
            return;
        }
        this.setState({
            showEditModal: true,
            selectedTask: task,
            newCategory: task.category,
            newTaskName: task.name,
        });
    }

    handleClose = () => {
        this.setState({
            showDeleteModal: false,
            showEditModal: false,
        })
    }

    sendChecklistUpdate = (value) => {
        this.setState({
            checklist: value,
            tasks: value.tasks,
        });
    }

    handleDelete = async(event, task) => {
        event.preventDefault();
        const deleteChecklistApi = import.meta.env.VITE_API_BASE_URL +  "tasks/" + task.id;
        this.setState({
            inputDisabled: true,
            showDeleteModal: false,
        });
        await axios.delete(deleteChecklistApi,
            {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            })
            .then((response) => {
                if (response.data === true) {
                    let {tasks} = this.state;
                    let deletedIndex = tasks.findIndex(cl => cl.id === task.id);
                    this.setState({
                        tasks: tasks.slice(0, deletedIndex).concat(tasks.slice(deletedIndex + 1)),
                    });
                }
                this.setState({
                    inputDisabled: false,
                });
            }).catch((error) => {
                console.error(error);
                this.setState({
                    inputDisabled: false,
                });
            });
    }

    handleEdit = async(event, task) => {
        event.preventDefault();
        const editTaskApi = import.meta.env.VITE_API_BASE_URL + "tasks/" + task.id;
        if (task.name === this.state.newTaskName && task.category === this.state.newCategory) {
            return;
        }
        this.setState({
            inputDisabled: true,
            showEditModal: false,
        });
        let requestBody = {
            task_id: task.id,
            name: this.state.newTaskName,
            category: this.state.newCategory,
        }
        await axios.put(editTaskApi,
            requestBody,
            {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            })
            .then((response) => {
                let {tasks} = this.state;
                let updatedIndex = tasks.findIndex(t => t.id === task.id);
                this.setState({tasks: tasks.slice(0, updatedIndex).concat(response.data).concat(tasks.slice(updatedIndex + 1))});
                this.setState({
                    inputDisabled: false,
                });
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
            <>
                <Modal backdropClassName={"edit-modal-bg"} show={this.state.showDeleteModal} onHide={this.handleClose} centered>
                    <Modal.Header className={"edit-modal"} closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"edit-modal"}>
                        <p>{"Are you sure to delete task \"" + (this.state.selectedTask ? this.state.selectedTask.name : "") + "\"?"}</p>
                    </Modal.Body>
                    <Modal.Footer className={"edit-modal"}>
                        <Button variant="primary" onClick={this.handleClose}>No</Button>
                        <Button variant="secondary" onClick={(event) => this.handleDelete(event, this.state.selectedTask)}>Yes</Button>
                    </Modal.Footer>
                </Modal>
                <Modal backdropClassName={"edit-modal-bg"} show={this.state.showEditModal} onHide={this.handleClose} centered>
                    <Modal.Header className={"edit-modal"} closeButton>
                        <Modal.Title>Edit task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"edit-modal row"}>
                        <div className={"col-8"}>
                            <input type={"text"} className={"edit-task-input"} id={"edit-task-name"} defaultValue={this.state.selectedTask ? this.state.selectedTask.name : ""}
                                   onChange={(event) => this.setState({newTaskName: event.target.value})}/>
                        </div>
                        <div className={"col-4"}>
                            <select name={"categories"} disabled={this.state.inputDisabled} defaultValue={this.state.selectedTask? this.state.selectedTask.category : "none"}
                                    onChange={(event) => this.setState({newCategory: event.target.value})}>
                                {
                                    this.state.categories.map((category) => (
                                        <option key={category + "-edit-" + this.state.checklist_id}
                                                value={category}>{category}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={"edit-modal"}>
                        <Button variant="primary"
                                onClick={(event) => this.handleEdit(event, this.state.selectedTask)}>Save</Button>
                        <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
                <div className={"row task-table accordion-collapse collapse"}
                     id={"task-table-" + this.state.checklist.id}>
                    {
                        this.state.tasks.map((task) => (
                            <div className={"row tasklist-item"} key={"admin-task-" + task.id}>
                                <div className={"col-2"}>
                                    {task.id}
                                </div>
                                <div className={"col-7"}>
                                    {task.name}
                                </div>
                                <div className={"col-2 task-category"}>
                                    <span className={"task-category-label label-" + task.category.toLowerCase()}>{task.category}</span>
                                </div>
                                <div className={"col-1 action"}>
                                    <a href={""} className={"edit-link"} onClick={(event) => this.showEditModal(event, task)}>
                                        <i className={"bi bi-pencil-fill " + (this.state.inputDisabled ? "disabled" : "")}></i>
                                    </a>
                                    <a href={""} className={"edit-link"} onClick={(event) => this.showDeleteModal(event, task)}>
                                        <i className={"bi bi-x-lg " + (this.state.inputDisabled ? "disabled" : "")}></i>
                                    </a>
                                </div>
                            </div>
                        ))
                    }
                    <div className={"row add-tasklist-item"}>
                        <AddTask categories={this.state.categories} inputDisabled={this.state.inputDisabled}
                                 checklistId={this.state.checklist.id} sendChecklistUpdate={this.sendChecklistUpdate} />
                    </div>
                </div>
            </>
        );
    }
}

class AddTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            taskName: '',
            checklistId: props.checklistId,
            category: '',
            inputDisabled: props.inputDisabled,
            categories: props.categories,
            sendChecklistUpdate: props.sendChecklistUpdate,
        }
    }

    setTaskName = (event) => {
        this.setState({
            taskName: event.target.value,
        });
    }

    setCategory = (event) => {
        this.setState({
            category: event.target.value,
        });
    }

    handleClick = async(event) => {
        if(this.state.taskName === '' || this.state.category === '') {
            return;
        }
        const addTaskRequest = {
            checklist_id: this.state.checklistId,
            name: this.state.taskName,
            category: this.state.category,
        }
        this.setState({
            inputDisabled: true,
        });
        const apiUrl = import.meta.env.VITE_API_BASE_URL +  "tasks/create";
        await axios.post(apiUrl,
            JSON.stringify(addTaskRequest),
            {
                headers: { 'Content-Type' : 'application/json',
                    'token': window.sessionStorage.getItem('token')}
            }).then((response) => {
            this.setState({
                inputDisabled: false,
            });
            this.state.sendChecklistUpdate(response.data);
        }).catch((error) => {
            console.error(error);
            this.setState({
                inputDisabled: false,
            });
        });
    }

    render() {
        return (
            <div className={"row"}>
                <div className={"col-1"}>
                </div>
                <div className={"col-6 p-2"}>
                    <input className={"add-new-task-input"} defaultValue={""} disabled={this.state.inputDisabled} type={"text"} required onChange={(event) => this.setTaskName(event)}/>
                </div>
                <div className={"col-2 p-2"}>
                    <select name={"categories"} disabled={this.state.inputDisabled} defaultValue={"none"}
                            onChange={(event) => this.setCategory(event)}>
                        <option value={"none"} disabled>Select one</option>
                        {
                            this.state.categories.map((category) => (
                                <option key={category + "-" + this.state.checklist_id} value={category}>{category}</option>
                            ))
                        }
                    </select>
                </div>
                <div className={"col-3 p-2"}>
                    <button className={"btn btn-primary add-new-task-button"} disabled={this.state.inputDisabled} onClick={(event) => this.handleClick(event)}>Add</button>
                </div>
            </div>
        );
    }
}

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: props.users,
        };
    }

    render() {
        return (
            <>
                <div className={"row"}>
                    <div className={"checklist-table col-8"}>Username</div>
                    <div className={"checklist-table col-3"}>Role</div>
                </div>
                {
                    this.state.users.map((user) => (
                        <div className={"row checklist-table checklist-item"} key={"admin-user-" + user.username}>
                            <div className={"col-8"}>{user.username}</div>
                            <div className={"col-3 user-role-label"}>
                                <span className={"user-role user-role-" + user.role.toLowerCase()}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    ))
                }
            </>
        );
    }

}

export default function (props) {
    const navigation = useNavigate();
    return <Dashboard navigation={navigation} />
}