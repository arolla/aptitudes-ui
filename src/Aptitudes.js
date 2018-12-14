import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { Grid, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import uuidv4 from 'uuid/v4';
import Employee from './Employee';
import EmployeeService from './EmployeeService';
import EditEmployee from './EditEmployee';

const styles = () => ({
    employee: {
        height: '300px',
        width: '300px',
    }
})

class Aptitudes extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            creatingEmployee: false,
        };
        this.onEmployeeCreationRequested = this.onEmployeeCreationRequested.bind(this);
        this.onEmployeeCreated = this.onEmployeeCreated.bind(this);
        this.onEmployeeCreationDone = this.onEmployeeCreationDone.bind(this);
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
    onEmployeeCreationRequested() {
        this.setState({ creatingEmployee: true });
    }
    onEmployeeCreated(employee) {
        EmployeeService.create(employee)
            .then(() => {
                this.message("employee " + employee.name + " created");
            })
            .catch(err => {
                this.error("employee creation failed: " + err);
            }).finally(() => {
                this.loadEmployees();
            });
    }
    onEmployeeCreationDone() {
        this.setState({ creatingEmployee: false });
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
                        <Employee
                            employee={employee}
                            onDelete={this.onEmployeeDeletionRequested}
                            onChange={this.onEmployeeChanged(clone(employee))}
                            onError={this.onError}
                        />
                    </Grid>)}
                </Grid>
                <Fab onClick={this.onEmployeeCreationRequested}><AddIcon fontSize='large' />
                </Fab>
                {this.state.creatingEmployee
                    ? <div className={classes.employee}><EditEmployee
                        employee={{ id: uuidv4(), name: '', skills: [] }}
                        onChange={this.onEmployeeCreated}
                        onClose={this.onEmployeeCreationDone}
                        onError={this.onError}
                    /></div>
                    : null
                }
            </div>
        );
    }
}

const clone = source => Object.assign({}, source);

export default withStyles(styles)(withSnackbar(Aptitudes));
