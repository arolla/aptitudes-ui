import React, {Component} from 'react';

class Skillz extends Component {
    constructor() {
        super();
        this.state = { employees: [] };
    }
    componentDidMount() {
        fetch("/employees")
            .then(result => result.json())
            .then(employees => {
                console.log("received " + JSON.stringify(employees));
                const newState = Object.assign({}, this.state, {employees: employees});
                console.log("new state: " + newState);
                this.setState(newState);
            });
    }
    render() {
        return(
            <div>
                <p>employees:</p>
                <ul>{
                    this.state.employees.map(employee => 
                        <li key={employee.name}>{employee.name}
                            <ul>
                                {employee.skills.map(skill=><li>{skill.name}</li>)}
                            </ul>
                        </li>
                    )
                }</ul>
            </div>
        );
    }
}

export default Skillz;
