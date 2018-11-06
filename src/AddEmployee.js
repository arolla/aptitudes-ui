import React, {Component} from 'react';

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
    handleSubmit(event) {
        event.preventDefault();
        this.props.onClose();
        console.log("Submitted");
    }
    addSkill(event) {
        event.preventDefault();
        this.setState({skills: this.state.skills.concat(this.state.newSkillName)});
        this.setState({newSkillName: ""});
    }
    handleNewSkillChange(event) {
        this.setState({newSkillName: event.target.value});
    }

    render() {
        return (
            <div>
                <p>Add employee</p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <p><label>Name:<input type="text" name="name" onChange={this.handleNameChange.bind(this)}/></label></p>
                    {this.state.skills.map(skill => <p key={skill}><label className="skillName">{skill}</label></p>)}
                    <p>
                        <input type="text" name="newSkillName" onChange={this.handleNewSkillChange.bind(this)}/>
                        <button onClick={this.addSkill.bind(this)}>Add skill</button>
                    </p>
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default AddEmployee;
