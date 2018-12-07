import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    employee: {
        height:'100%',
        width: '100%',
        'box-sizing': 'border-box',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        bottom: '0',
   },
});

class Employee extends Component {
    constructor() {
        super();
        this.onDelete = this.onDelete.bind(this);
    }
    onDelete() {
        this.props.onDelete(this.props.employee);
    }
    render() {
        const { employee, classes } = this.props;
        return (
            <Card className={classes.employee}><div>
                <CardContent>
                    <Typography variant="h5" component="h1">{employee.name}</Typography>
                    {employee.skills.map(skill => {
                        return <Typography key={skill.name}>{skill.name}->{skill.level}</Typography>
                    })}
                </CardContent>
                <div className={classes.controls}>
                    <Button variant='fab' mini color='secondary' aria-label="Delete" onClick={this.onDelete}><DeleteIcon /></Button>
                </div>
            </div></Card>
        )
    }
}

export default withStyles(styles)(Employee);