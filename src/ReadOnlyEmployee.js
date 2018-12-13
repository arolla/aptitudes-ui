import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, CardActions, Table, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
        this.onDelete = this.onDelete.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }
    onDelete() {
        this.props.onDelete();
    }
    onEdit() {
        this.props.onEdit();
    }
    render() {
        const { employee, classes } = this.props;
        return (
            <Card className={classes.employee}>
                <CardContent className={classes.cardContent}>
                    <Typography variant="h5" component="h1">{employee.name}</Typography>
                    <div className={classes.skillsListContainer}>
                        <Table>
                            <TableBody>
                                {employee.skills.map(skill => <TableRow key={skill.name}>
                                    <TableCell>{skill.name}</TableCell>
                                    <TableCell>{skill.level}</TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    <IconButton color='secondary' aria-label="Delete" onClick={this.onDelete}><DeleteIcon /></IconButton>
                    <IconButton aria-label="Edit" onClick={this.onEdit}><EditIcon /></IconButton>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Employee);
