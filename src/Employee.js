import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, CardActions } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/Button';
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
        'flex-direction': 'column',
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
                <CardContent>
                    {readOnly
                        ? <Typography variant="h5" component="h1">{employee.name}</Typography>
                        : <Input placeholder={employee.name} onChange={this.onNameChange}></Input>
                    }
                    {employee.skills.map(skill => {
                        return <Typography key={skill.name}>{skill.name}->{skill.level}</Typography>
                    })}
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