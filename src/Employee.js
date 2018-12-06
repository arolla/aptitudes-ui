import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    employee: {
        padding: theme.spacing.unit,
        height:'100%',
        width: '100%',
        'box-sizing': 'border-box',
   },
});

class Employee extends Component {
    render() {
        const { employee, classes } = this.props;
        return (
            <Paper className={classes.employee}>
                <Typography variant="h5" component="h1">{employee.name}</Typography>
                {employee.skills.map(skill => {
                    return <Typography key={skill.name}>{skill.name}->{skill.level}</Typography>
                })}
            </Paper>
        )
    }
}

export default withStyles(styles)(Employee);