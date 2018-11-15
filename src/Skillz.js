import React, { Component } from 'react';
import AddEmployee from './AddEmployee';

class Skillz extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            createEmployee: false,
            message: "",
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
            message: "employee added"
        });
    }
    render() {
        return (
            <div>
                <p>employees:</p>
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
                    ? <AddEmployee onAdded={this.onEmployeeAdded.bind(this)} />
                    : null
                }
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default Skillz;
