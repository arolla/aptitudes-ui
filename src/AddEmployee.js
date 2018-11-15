import React, { Component } from 'react';

class AddEmployee extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            newSkillName: "",
            skills: []
        };
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
        const jsonSkills = this.state.skills.map(name => {
            return {"name": name}
        });
        const jsonEmployee = JSON.stringify({name: this.state.name, skills: jsonSkills});
        fetch("/employees", {
            method: 'POST',
            body: jsonEmployee,
            headers: {
                'Content-Type': "application/json;charset=UTF-8",
                Accept: 'application/json'
            }
        })
        .then(response => {
            this.handleFetchErrors(response);
            response.json();
        })
        .then(data => this.props.onAdded())
        .catch(err => this.props.onError(err));
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
                        <input type="text" name="newSkillName" onChange={this.handleNewSkillChange.bind(this)} value={this.state.newSkillName} />
                        <button onClick={this.addSkill.bind(this)}>Add skill</button>
                    </p>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default AddEmployee;
