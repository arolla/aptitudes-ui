import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EditEmployee from './EditEmployee';
import ReadOnlyEmployee from './ReadOnlyEmployee';

const styles = () => ({
    employee: {
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
    },
});

class Employee extends Component {
    constructor() {
        super();
        this.state = {
            readOnly: true,
        }
        this.onEdit = this.onEdit.bind(this);
        this.onEditionDone = this.onEditionDone.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    onDelete() {
        this.props.onDelete(this.props.employee);
    }
    onEdit() {
        this.setState({ readOnly: false });
    }
    onChange() {
        this.props.onChange(this.props.employee);
    }
    onEditionDone() {
        this.setState({ readOnly: true });
    }
    render() {
        const { employee, classes, allSkills } = this.props;
        const { readOnly } = this.state;
        return (
            <div className={classes.employee}>{readOnly
                ? <ReadOnlyEmployee employee={employee} className={classes.employee} onEdit={this.onEdit} onDelete={this.onDelete} />
                : <EditEmployee employee={employee} allSkills={allSkills}
                    className={classes.employee} onChange={this.onChange} onClose={this.onEditionDone} 
                />
            }</div>
        )
    }
}

export default withStyles(styles)(Employee);
