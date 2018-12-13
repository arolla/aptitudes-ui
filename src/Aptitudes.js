import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CreateEmployee from './CreateEmployee';
import Employee from './Employee';
import EmployeeService from './EmployeeService';

const styles = () => ({
    employee: {
        height: '300px',
        width: '300px'
    }
})

class Aptitudes extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            creatingEmployee: false,
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
        this.setState({ creatingEmployee: false });
        this.message("employee added");
        this.loadEmployees();
    }
    onEmployeeDeletionRequested(employee) {
        EmployeeService.delete(employee)
            .then(() => {
                this.message("employee " + employee.name + " deleted");
            })
            .catch(error => {
                this.error("employee deletion failed: " + error);
            })
            .finally(() => {
                this.loadEmployees();
            });
    }
    onError(error) {
        this.error("employee creation failed: " + error);
    }
    onEmployeeChanged = oldEmployee => newEmployee => {
        EmployeeService.update(newEmployee)
            .then(() => {
                this.message("employee " + oldEmployee.name + " updated to " + JSON.stringify(newEmployee));
            })
            .catch(error => {
                this.error("employee update failed: " + error);
            })
            .finally(() => {
                this.loadEmployees();
            });
    }
    message(message) {
        this.props.enqueueSnackbar(message, { variant: 'info' });
    }
    error(error) {
        this.props.enqueueSnackbar(error, { variant: 'error' });
    }

    render() {
        const { employees } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction='row' className={classes.root} spacing={8}>
                    {employees.map(employee => <Grid key={employee.name} className={classes.employee}>
                        <Employee employee={employee}
                            onDelete={this.onEmployeeDeletionRequested}
                            onChange={this.onEmployeeChanged(clone(employee))}
                            onError={this.onError}
                        />
                    </Grid>)}
                </Grid>
                <Button variant='outlined' onClick={this.createEmployee}>Do you wanna create?</Button>
                {this.state.creatingEmployee
                    ? <CreateEmployee onCreated={this.onEmployeeCreated} onError={this.onError} />
                    : null
                }
            </div>
        );
    }
}

const clone = source => Object.assign({}, source);

export default withStyles(styles)(withSnackbar(Aptitudes));
