import React, { Component } from 'react';

class AddEmployee extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            newSkillName: "",
            skills: []
        }
    }
    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }
    handleFetchErrors(response) {
        if (!response.ok)
            throw Error(JSON.stringify(response));
        return response;
    }
    handleSubmit(event) {
        event.preventDefault();
        const employee = {name: this.state.name, skills: this.state.skills};
        fetch("/employees", {
            method: 'post',
            body: employee
        })
        .then(response => response.json())
        .then(data => this.handleFetchErrors(data))
        .then(data => console.log("=== created " + JSON.stringify(employee) + " -> " + JSON.stringify(data)))
        .catch(err => {
            console.log("!!!! failed creating " + JSON.stringify(employee) + " caused by:");
            console.log(err);
        });
        this.props.onClose();
    }
    addSkill(event) {
        event.preventDefault();
        this.setState({
            skills: this.state.skills.concat(this.state.newSkillName),
            newSkillName: ""
        });
    }
    handleNewSkillChange(event) {
        this.setState({ newSkillName: event.target.value });
    }

    render() {
        return (
            <div>
                <p>Add employee</p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <p><label>Name:<input type="text" name="name" onChange={this.handleNameChange.bind(this)} /></label></p>
                    {this.state.skills.map(skill => <p key={skill}><label className="skillName">{skill}</label></p>)}
                    <p>
                        <input type="text" name="newSkillName" onChange={this.handleNewSkillChange.bind(this)} />
                        <button onClick={this.addSkill.bind(this)}>Add skill</button>
                    </p>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default AddEmployee;
