import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CreateEmployee from './CreateEmployee';
import Employee from './Employee';
import EmployeeService from './EmployeeService';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    employee: {
        height: '200px',
        width: '200px',
    }
})

class Aptitudes extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            creatingEmployee: false,
            message: "",
            error: "",
        };
        this.createEmployee = this.createEmployee.bind(this);
        this.onEmployeeCreated = this.onEmployeeCreated.bind(this);
        this.onError = this.onError.bind(this);
        this.onEmployeeDeletionRequested = this.onEmployeeDeletionRequested.bind(this);
    }
    componentDidMount() {
        this.loadEmployees();
    }
    loadEmployees() {
        EmployeeService.all()
            .then(employees => this.setState({ employees }))
            .then(() => {
                if (this.props.onRefreshed)
                    this.props.onRefreshed();
            });
    }
    createEmployee() {
        this.setState({ creatingEmployee: true });
    }
    onEmployeeCreated() {
        this.setState({
            creatingEmployee: false,
            message: "employee added",
            error: "",
        });
        this.loadEmployees();
    }
    onEmployeeDeletionRequested(employee) {
        EmployeeService.delete(employee)
            .then(() => {
                this.setState({
                    message: "employee " + employee.name + " deleted",
                    error: "",
                })
            })
            .then(() => {
                this.loadEmployees();
            })
            .catch(error => {
                this.setState({
                    error: "employee deletion failed: " + error,
                    message: "",
                })
            });
    }
    onError(error) {
        this.setState({
            error: "employee creation failed: " + error,
            message: "",
        });
    }
    onEmployeeChanged = oldEmployee => newEmployee => {
        this.setState({
            message: "employee " + oldEmployee.name + " updated to " + JSON.stringify(newEmployee),
            error: "",
        })
    }

    render() {
        const { employees, message, error } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction='row' className={classes.root} spacing={8}>
                    {employees.map(employee => <Grid item key={employee.name} className={classes.employee}>
                        <Employee employee={employee} 
                            onDelete={this.onEmployeeDeletionRequested} 
                            onChange={this.onEmployeeChanged(clone(employee))} 
                        />
                    </Grid>)}
                </Grid>
                <Button variant='outlined' onClick={this.createEmployee}>Do you wanna create?</Button>
                {this.state.creatingEmployee
                    ? <CreateEmployee onCreated={this.onEmployeeCreated} onError={this.onError} />
                    : null
                }
                <p className='message'>{message}</p>
                <p className='error'>{error}</p>
            </div>
        );
    }
}

const clone = source => Object.assign({}, source);

export default withStyles(styles)(Aptitudes);
