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
        this.onEmployeeCreationRequested = this.onEmployeeCreationRequested.bind(this);
        this.onEmployeeCreated = this.onEmployeeCreated.bind(this);
        this.onEmployeeCreationDone = this.onEmployeeCreationDone.bind(this);
        this.onEmployeeDeletionRequested = this.onEmployeeDeletionRequested.bind(this);
        this.onFilterSkillAdded = this.onFilterSkillAdded.bind(this);
        this.onEditedFilterSkillChanged = this.onEditedFilterSkillChanged.bind(this);
        this.onError = this.onError.bind(this);
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
            .catch(err => this.props.onError(err));
    }
    loadAllSkills() {
        EmployeeService.skills()
            .then(allSkills => this.setState({ allSkills }))
            .catch(err => this.props.onError(err));
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
                this.refresh();
            });
    }
    onEmployeeCreationDone() {
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
    onEmployeeDeletionRequested(employee) {
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
    onFilterSkillAdded() {
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
                filterSkills: state.filterSkills.filter(skill => skill != skillToDelete),
            }
        });
        this.filter();
    }
    onEditedFilterSkillChanged(event) {
        this.setState({ editedFilterSkill: event.target.value });
    }
    filter() {
        this.setState(state => {
            if (state.filterSkills.length)
                return { filteredEmployees: state.employees.filter(employee => employee.skills.some(skill => state.filterSkills.indexOf(skill.name) >= 0)) }
            else
                return { filteredEmployees: state.employees };
        });
    }
    onError(error) {
        this.error("employee creation failed: " + error);
    }
    message(message) {
        this.props.enqueueSnackbar(message, { variant: 'info' });
    }
    error(error) {
        this.props.enqueueSnackbar(error, { variant: 'error' });
    }

    render() {
        const { filteredEmployees, allSkills, filterSkills, editedFilterSkill } = this.state;
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
                            onChange={this.onEmployeeChanged(clone(employee))}
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
                    /></div>
                    : null
                }
            </div>
        );
    }
}

const clone = source => Object.assign({}, source);

export default withStyles(styles)(withSnackbar(Aptitudes));
