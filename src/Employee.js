import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, CardActions, Table, TableBody, TableRow, TableCell, Grid, Input, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';

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
    editedSkillItem: {
        overflow:'hidden',
    },
    editedSkillName: {
        marginRight:'auto',
    },
    editedSkillLevel: {
        width: '60px',
    },
    actions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'right',
        marginTop: 'auto',
        paddingRight: 0,
    },
});

class Employee extends Component {
    constructor() {
        super();
        this.state = {
            readOnly: true,
        }
        this.onDelete = this.onDelete.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onEditionDone = this.onEditionDone.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }
    onDelete() {
        this.props.onDelete(this.props.employee);
    }
    onEdit() {
        this.setState({ readOnly: false });
    }
    onEditionDone() {
        this.setState({ readOnly: true });
        this.props.onChange(this.props.employee);
    }
    onCancel() {
        this.setState({ readOnly: true });
    }
    onNameChange(event) {
        this.props.employee.name = event.target.value;
    }
    onSkillLevelChange = oldSkill => event => {
        oldSkill.level = event.target.value;
    }
    onSkillDeletionRequest = skill => () => {
        const skills = this.props.employee.skills;
        skills.splice(skills.indexOf(skill), 1);
        this.forceUpdate();
    }
    render() {
        const { employee, classes } = this.props;
        const { readOnly } = this.state;
        return (
            <Card className={classes.employee}>
                <CardContent className={classes.cardContent}>
                    {readOnly
                        ? <Typography variant="h5" component="h1">{employee.name}</Typography>
                        : <Input placeholder={employee.name} onChange={this.onNameChange}></Input>
                    }
                    <div className={classes.skillsListContainer}>
                        {readOnly
                            ? <Table>
                                <TableBody>
                                    {employee.skills.map(skill => <TableRow>
                                        <TableCell>{skill.name}</TableCell>
                                        <TableCell>{skill.level}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                            :  <Grid container direction='column'>
                                {employee.skills.map(skill =>
                                    <Grid item className={classes.editedSkillItem}><Grid container direction='row' alignItems='center' justify='flex-end' spacing={16}>
                                        <Grid item className={classes.editedSkillName}><Typography>{skill.name}</Typography></Grid>
                                        <Grid item><Input type='number' className={classes.editedSkillLevel}
                                            inputProps={{ min: 0, max: 3 }} defaultValue={skill.level}
                                            onChange={this.onSkillLevelChange(skill)}>
                                        </Input></Grid>
                                        <Grid item><IconButton  aria-label="Delete"
                                            onClick={this.onSkillDeletionRequest(skill)}><DeleteIcon />
                                        </IconButton></Grid>
                                    </Grid></Grid>
                                )}
                            </Grid>
                        }
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    {readOnly
                        ? <IconButton color='secondary' aria-label="Delete" onClick={this.onDelete}><DeleteIcon /></IconButton>
                        : <IconButton aria-label="Cancel" onClick={this.onCancel}><CancelIcon /></IconButton>
                    }
                    {readOnly
                        ? <IconButton aria-label="Edit" onClick={this.onEdit}><EditIcon /></IconButton>
                        : <IconButton aria-label="Done" onClick={this.onEditionDone}><CheckIcon /></IconButton>
                    }
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Employee);
