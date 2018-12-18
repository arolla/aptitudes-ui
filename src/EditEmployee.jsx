import React, { Component } from 'react';
import { Card, CardContent, CardActions, Grid, Input, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import SkillsSuggestor from './SkillsSuggestor';
import clonedeep from 'lodash/cloneDeep'

const styles = () => ({
    employee: {
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
    },
    cardContent: {
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    skillsListContainer: {
        overflowY: 'auto',
    },
    skillItem: {
        overflow: 'hidden',
    },
    skillName: {
        marginRight: 'auto',
        minWidth: 0,
    },
    skillLevel: {
        width: '30px',
    },
    actions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'right',
        marginTop: 'auto',
        paddingRight: 0,
    },
});

class EditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = { employee: clonedeep(props.employee) };
    }
    onDone = () => {
        this.props.onChange(this.state.employee);
        this.props.onClose();
    }
    onCancel = () => {
        this.props.onClose();
    }
    onNameChange = (event) => {
        const name = event.target.value;
        this.setState(state => {
            return { employee: { ...state.employee, name } };
        })
    }
    onSkillLevelChange = oldSkill => event => {
        const level = Number(event.target.value);
        this.setState(state => {
            const newSkills = updateArrayItem(state.employee.skills, oldSkill, 'level', level);
            return { employee: { ...state.employee, skills: newSkills } };
        });
    }
    onSkillNameChange = oldSkill => event => {
        const name = event.target.value;
        this.setState(state => {
            const newSkills = updateArrayItem(state.employee.skills, oldSkill, 'name', name);
            return { employee: { ...state.employee, skills: newSkills } };
        });
    }
    onSkillDeletionRequest = skillToDelete => () => {
        this.setState(state => {
            const newSkills = state.employee.skills.filter(skill => skill !== skillToDelete);
            return { employee: { ...state.employee, skills: newSkills } };
        })
    }
    onAddSkill = () => {
        this.setState(state => {
            const newSkills = state.employee.skills.concat({ name: "", level: 0 });
            return { employee: { ...state.employee, skills: newSkills } };
        })
    }
    render() {
        const { classes } = this.props;
        const { employee } = this.state;
        return (
            <Card className={classes.employee}
                onKeyUp={(event) => {
                    if (event.key === 'Enter')
                        this.onDone();
                    else if (event.key === 'Escape')
                        this.onCancel();
                }}
            >
                <CardContent className={classes.cardContent}>
                    <Input value={employee.name} onChange={this.onNameChange} />
                    <div className={classes.skillsListContainer}>
                        <Grid container direction='column'>
                            {employee.skills.map(skill =>
                                <Grid item key={skill.name} className={classes.skillItem}>
                                    <Grid container direction='row' alignItems='center' justify='flex-end' spacing={16} wrap='nowrap'>
                                        <Grid item className={classes.skillName}>
                                            <SkillsSuggestor
                                                value={skill.name}
                                                skills={this.props.allSkills}
                                                onChange={this.onSkillNameChange(skill)}
                                            />
                                        </Grid>
                                        <Grid item><Input type='number' className={classes.skillLevel}
                                            inputProps={{ min: 0, max: 3 }} defaultValue={skill.level}
                                            onChange={this.onSkillLevelChange(skill)} />
                                        </Grid>
                                        <Grid item><IconButton aria-label="Delete"
                                            onClick={this.onSkillDeletionRequest(skill)}><DeleteIcon />
                                        </IconButton></Grid>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                        <IconButton aria-label="Add" onClick={this.onAddSkill}><AddIcon /></IconButton>
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    <IconButton aria-label="Cancel" onClick={this.onCancel}><CancelIcon /></IconButton>
                    <IconButton aria-label="Done" onClick={this.onDone}><CheckIcon /></IconButton>
                </CardActions>
            </Card>
        )
    }
}

const updateArrayItem = (array, itemToUpdate, propertyToUpdate, value) => {
    return array.map(item => {
        if (item === itemToUpdate)
            return { ...item, [propertyToUpdate]: value };
        else
            return item;
    });
}

export default withStyles(styles)(EditEmployee);
