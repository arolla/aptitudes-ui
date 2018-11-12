import React, {Component} from 'react';
import AddEmployee from './AddEmployee';

class Skillz extends Component {
    constructor() {
        super();
        this.state = { 
            employees: [],
            createEmployee: false
        };
    }
    componentDidMount() {
        fetch("/employees")
            .then(result => result.json())
            .then(employees => {
                const newState = Object.assign({}, this.state, {employees: employees});
                this.setState(newState);
                this.props.onMounted();
            });
    }
    createEmployee() {
        this.setState({createEmployee: true});
    }
    onEmployeeCreated() {
        console.log("Employee done");
        this.setState({createEmployee:false})
    }
    render() {
        return(
            <div>
                <p>employees:</p>
                <ul>{
                    this.state.employees.map(employee => 
                        <li key={employee.name}>{employee.name}
                            <ul>
                                {employee.skills.map(skill=><li key={skill.name}>{skill.name}</li>)}
                            </ul>
                        </li>
                    )
                }</ul>
                <button onClick={this.createEmployee.bind(this)}>Do you wanna create?</button>
                {this.state.createEmployee
                    ? <AddEmployee onClose={this.onEmployeeCreated.bind(this)}/>
                    : null
                }
            </div>
        );
    }
}

export default Skillz;
