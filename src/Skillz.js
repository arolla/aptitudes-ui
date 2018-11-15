import React, { Component } from 'react';
import AddEmployee from './AddEmployee';

class Skillz extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            createEmployee: false,
            message: "",
            error:"",
        };
    }
    componentDidMount() {
        fetch("/employees")
            .then(result => result.json())
            .then(employees => {
                this.setState({ employees });
                this.props.onMounted();
            });
    }
    createEmployee() {
        this.setState({ createEmployee: true });
    }
    onEmployeeAdded() {
        this.setState({ 
            createEmployee: false,
            message: "employee added",
            error: "",
        });
    }
    onError(error) {
        this.setState({
            error: "employee creation failed: " + error,
            message: "",
        });
    }
    render() {
        return (
            <div>
                <h1>employees:</h1>
                <ul>{
                    this.state.employees.map(employee =>
                        <li key={employee.name}>{employee.name}
                            <ul>
                                {employee.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}
                            </ul>
                        </li>
                    )
                }</ul>
                <button onClick={this.createEmployee.bind(this)}>Do you wanna create?</button>
                {this.state.createEmployee
                    ? <AddEmployee onAdded={this.onEmployeeAdded.bind(this)} onError={this.onError.bind(this)} />
                    : null
                }
                <p className='message'>{this.state.message}</p>
                <p className='error'>{this.state.error}</p>
            </div>
        );
    }
}

export default Skillz;
