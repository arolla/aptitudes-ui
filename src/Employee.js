import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, CardActions, Table, TableRow, TableCell, Input, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    employee: {
        height: '100%',
        width: '100%',
        'box-sizing': 'border-box',
        display: 'flex',
        flex: '1 1 auto',
        'flex-direction': 'column',
    },
    cardContent: {
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    skillsListContainer: {
        overflowY: 'auto'
    },
    actions: {
        width: '100%',
        display: 'flex',
        'justify-content': 'right',
        'margin-top': 'auto',
        'padding-right': 0,
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
    onNameChange(event) {
        this.props.employee.name = event.target.value;
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
                        <Table>
                            {employee.skills.map(skill => <TableRow>
                                <TableCell>{skill.name}</TableCell>
                                <TableCell numeric>{skill.level}</TableCell>
                            </TableRow>)}
                        </Table>
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    <IconButton color='secondary' aria-label="Delete" onClick={this.onDelete}><DeleteIcon /></IconButton>
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