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
        height: '150px',
        width: '150px',
    }
})

class Aptitudes extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            createEmployee: false,
            message: "",
            error: "",
        };
        this.createEmployee = this.createEmployee.bind(this);
        this.onEmployeeCreated = this.onEmployeeCreated.bind(this);
        this.onError = this.onError.bind(this);
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
        this.setState({ createEmployee: true });
    }
    onEmployeeCreated() {
        this.setState({
            createEmployee: false,
            message: "employee added",
            error: "",
        });
        this.loadEmployees();
    }
    onError(error) {
        this.setState({
            error: "employee creation failed: " + error,
            message: "",
        });
    }
    render() {
        const { employees, message, error } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction='row' className={classes.root} spacing={8}>
                    {employees.map(employee => <Grid item key={employee.name} className={classes.employee}><Employee employee={employee} /></Grid>)}
                </Grid>
                <Button variant='outlined' onClick={this.createEmployee}>Do you wanna create?</Button>
                {this.state.createEmployee
                    ? <CreateEmployee onCreated={this.onEmployeeCreated} onError={this.onError} />
                    : null
                }
                <p className='message'>{message}</p>
                <p className='error'>{error}</p>
            </div>
        );
    }
}

export default withStyles(styles)(Aptitudes);
