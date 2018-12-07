import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EmployeeService from './EmployeeService';
import SkillsSuggestor from './SkillsSuggestor';
import uuidv4 from 'uuid/v4'

class CreateEmployee extends Component {
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
        const jsonEmployee = JSON.stringify({ id: uuidv4(), name: this.state.name, skills: this.state.skills });
        EmployeeService.create(jsonEmployee)
            .then(() => {
                if (this.props.onCreated)
                    this.props.onCreated();
            })
            .catch(err => {
                if (this.props.onError)
                    this.props.onError(err);
            });
    }
    addSkill(event) {
        event.preventDefault();
        this.setState({
            skills: this.state.skills.concat({ name: this.state.newSkillName, level: this.state.newSkillLevel }),
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
                    <TextField name="employeeName" label="Employee Name" onChange={this.handleNameChange} />
                    {this.state.skills.map(skill => <p key={skill.name}>
                        <label className="skillName">{skill.name}</label>
                        <label>-></label>
                        <label className="skillLevel">{skill.level}</label>
                    </p>)}
                    <div>
                        <SkillsSuggestor onError={this.props.onError} onChange={this.handleNewSkillNameChange} value={this.state.newSkillName} />
                        <TextField type="number" name="newSkillLevel" label="Skill Level" onChange={this.handleNewSkillLevelChange} value={this.state.newSkillLevel} />
                        <Button id="addSkill" variant="fab" mini aria-label="Add Skill" onClick={this.addSkill}><AddIcon /></Button>
                    </div>
                    <Button type="submit" variant='contained' color='primary'>Add</Button>
                </form>
            </div>
        );
    }
}

export default CreateEmployee;
