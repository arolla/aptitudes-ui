import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AddEmployee from './AddEmployee';
import EmployeeService from './EmployeeService';
import { Paper } from '@material-ui/core';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    employee: {
        padding: theme.spacing.unit * 2,
        height:'150px',
        width: '150px',
    },
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
        this.onEmployeeAdded = this.onEmployeeAdded.bind(this);
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
    onEmployeeAdded() {
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
                    {employees.map(employee => <Grid item key={employee.name} style={{height:'100%'}}><Paper className={classes.employee}>
                        <Typography variant="h5" component="h1">{employee.name}</Typography>
                        {employee.skills.map(skill => {
                            return <Typography key={skill.name}>{skill.name}->{skill.level}</Typography>
                        })}
                    </Paper></Grid>)}
                </Grid>
                <Button variant='outlined' onClick={this.createEmployee}>Do you wanna create?</Button>
                {this.state.createEmployee
                    ? <AddEmployee onAdded={this.onEmployeeAdded} onError={this.onError} />
                    : null
                }
                <p className='message'>{message}</p>
                <p className='error'>{error}</p>
            </div>
        );
    }
}

export default withStyles(styles)(Aptitudes);
