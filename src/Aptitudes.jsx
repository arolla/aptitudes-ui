import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import { Grid, Fab, IconButton, Chip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import uuidv4 from 'uuid/v4';
import Employee from './Employee';
import EmployeeService from './EmployeeService';
import EditEmployee from './EditEmployee';
import SkillsSuggestor from './SkillsSuggestor';

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
            filteredEmployees: [],
            allSkills: [],
            filterSkills: [],
            editedFilterSkill: '',
            creatingEmployee: false,
        };
    }

    componentDidMount() {
        this.refresh();
    }
    refresh() {
        this.loadEmployees();
        this.loadAllSkills();
    }
    loadEmployees() {
        EmployeeService.all()
            .then(employees => {
                this.setState({ employees });
                this.filter();
            })
            .catch(err => this.error(err));
    }
    loadAllSkills() {
        EmployeeService.skills()
            .then(allSkills => this.setState({ allSkills }))
            .catch(err => this.error(err));
    }

    onEmployeeCreationRequested = () => {
        this.setState({ creatingEmployee: true });
    }
    onEmployeeCreated = (employee) => {
        EmployeeService.create(employee)
            .then(() => {
                this.message("employee " + employee.name + " created");
            })
            .catch(err => {
                this.error("employee creation failed: " + err);
            }).finally(() => {
                this.refresh();
            });
    }
    onEmployeeCreationDone = () => {
        this.setState({ creatingEmployee: false });
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
                this.refresh();
            });
    }
    onEmployeeDeletionRequested = (employee) => {
        EmployeeService.delete(employee)
            .then(() => {
                this.message("employee " + employee.name + " deleted");
            })
            .catch(error => {
                this.error("employee deletion failed: " + error);
            })
            .finally(() => {
                this.refresh();
            });
    }
    onFilterSkillAdded = () => {
        if (this.state.editedFilterSkill === '')
            return;
        this.setState(state => {
            return {
                filterSkills: state.filterSkills.concat(state.editedFilterSkill),
                editedFilterSkill: '',
            }
        });
        this.filter();
    }
    onFilterSkillDeleted = (skillToDelete) => () => {
        this.setState(state => {
            return {
                filterSkills: state.filterSkills.filter(skill => skill !== skillToDelete),
            }
        });
        this.filter();
    }
    onEditedFilterSkillChanged = (event) => {
        this.setState({ editedFilterSkill: event.target.value });
    }
    filter() {
        this.setState(state => {
            if (state.filterSkills.length) {
                const newFilteredEmployees = state.employees
                    .filter(employee => containsOne(employee.skills, state.filterSkills))
                return { filteredEmployees: newFilteredEmployees }
            }
            else
                return { filteredEmployees: state.employees };
        });
    }
    message(message) {
        this.props.enqueueSnackbar(message, { variant: 'info' });
    }
    error(error) {
        this.props.enqueueSnackbar(error, { variant: 'error' });
    }

    render() {
        const { filteredEmployees, allSkills, filterSkills, editedFilterSkill, creatingEmployee } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Grid container direction="row">
                    <Grid item xs={2}>
                        <SkillsSuggestor
                            skills={allSkills}
                            placeholder='filter'
                            value={editedFilterSkill}
                            onChange={this.onEditedFilterSkillChanged}
                        />
                    </Grid>
                    <Grid item><IconButton onClick={this.onFilterSkillAdded}><AddIcon /></IconButton></Grid>
                </Grid>
                <Grid container direction="row">
                    {filterSkills.map(skill => <Chip key={skill} label={skill} onDelete={this.onFilterSkillDeleted(skill)} />)}
                </Grid>
                <Grid container direction='row' className={classes.root} spacing={8}>
                    {filteredEmployees.map(employee => <Grid key={employee.name} className={classes.employee}>
                        <Employee
                            employee={employee} allSkills={allSkills}
                            onDelete={this.onEmployeeDeletionRequested}
                            onChange={this.onEmployeeChanged(employee)}
                        />
                    </Grid>)}
                </Grid>
                <Fab onClick={this.onEmployeeCreationRequested}><AddIcon fontSize='large' /></Fab>
                {creatingEmployee
                    ? <div className={classes.employee}><EditEmployee
                        employee={{ id: uuidv4(), name: '', skills: [] }} allSkills={allSkills}
                        onChange={this.onEmployeeCreated}
                        onClose={this.onEmployeeCreationDone}
                    /></div>
                    : null
                }
            </div>
        );
    }
}

const containsOne = (array1, array2) => array1.some(item => array2.indexOf(item.name) >= 0);

export default withStyles(styles)(withSnackbar(Aptitudes));
