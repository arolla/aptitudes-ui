import React, { Component } from 'react';
import { Card, CardContent, CardActions, Grid, Input, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import SkillsSuggestor from './SkillsSuggestor';

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
    constructor() {
        super();
        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onAddSkill = this.onAddSkill.bind(this);
    }

    onDone() {
        this.props.onChange(this.props.employee);
        this.props.onClose();
    }
    onCancel() {
        this.props.onClose();
    }
    onNameChange(event) {
        this.props.employee.name = event.target.value;
    }
    onSkillLevelChange = skill => event => {
        skill.level = event.target.value;
    }
    onSkillNameChange = skill => event => {
        skill.name = event.target.value;
    }
    onSkillDeletionRequest = skill => () => {
        const skills = this.props.employee.skills;
        skills.splice(skills.indexOf(skill), 1);
        this.forceUpdate();
    }
    onAddSkill() {
        this.props.employee.skills.push({ name: "", level: 0 });
        this.forceUpdate();
    }
    render() {
        const { employee, classes } = this.props;
        return (
            <Card className={classes.employee}>
                <CardContent className={classes.cardContent}>
                    <Input placeholder={employee.name} onChange={this.onNameChange} />
                    <div className={classes.skillsListContainer}>
                        <Grid container direction='column'>
                            {employee.skills.map(skill =>
                                <Grid item key={skill.name} className={classes.skillItem}><Grid container direction='row' alignItems='center' justify='flex-end' spacing={16} wrap='nowrap'>
                                    <Grid item className={classes.skillName}>
                                        <SkillsSuggestor
                                            placeholder={skill.name}
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
                                </Grid></Grid>
                            )}
                        </Grid>
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    <IconButton aria-label="Cancel" onClick={this.onCancel}><CancelIcon /></IconButton>
                    <IconButton aria-label="Add" onClick={this.onAddSkill}><AddIcon /></IconButton>
                    <IconButton aria-label="Done" onClick={this.onDone}><CheckIcon /></IconButton>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(EditEmployee);
