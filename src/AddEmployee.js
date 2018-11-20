import React, { Component } from 'react';
import EmployeeService from './EmployeeService';

class AddEmployee extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            newSkillName: "",
            newSkillLevel: "",
            skills: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNewSkillNameChange = this.handleNewSkillNameChange.bind(this);
        this.handleNewSkillLevelChange = this.handleNewSkillLevelChange.bind(this);
        this.addSkill = this.addSkill.bind(this);
    }
    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        const jsonEmployee = JSON.stringify({name: this.state.name, skills: this.state.skills});
        EmployeeService.create(jsonEmployee)
            .then(() =>  {
                if (this.props.onAdded)
                    this.props.onAdded();
            })
            .catch(err => {
                if (this.props.onError)
                    this.props.onError(err);
            });
    }
    addSkill(event) {
        event.preventDefault();
        this.setState({
            skills: this.state.skills.concat({name: this.state.newSkillName, level: this.state.newSkillLevel}),
            newSkillName: "",
            newSkillLevel: "",
        });
    }
    handleNewSkillNameChange(event) {
        this.setState({ newSkillName: event.target.value });
    }
    handleNewSkillLevelChange(event) {
        if (event.target.value < 0 || event.target.value > 3)
            return false;
        this.setState({ newSkillLevel: event.target.value });
    }

    render() {
        return (
            <div>
                <p>Add employee</p>
                <form onSubmit={this.handleSubmit}>
                    <p><label>Name:<input type="text" name="name" onChange={this.handleNameChange} /></label></p>
                    {this.state.skills.map(skill => <p key={skill.name}>
                        <label className="skillName">{skill.name}</label>
                        <label>-></label>
                        <label className="skillLevel">{skill.level}</label>
                    </p>)}
                    <p>
                        <input type="text" name="newSkillName" onChange={this.handleNewSkillNameChange} value={this.state.newSkillName} />
                        <input type="number" name="newSkillLevel" onChange={this.handleNewSkillLevelChange} value={this.state.newSkillLevel} />
                        <button onClick={this.addSkill}>Add skill</button>
                    </p>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default AddEmployee;
