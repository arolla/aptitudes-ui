import React, { Component } from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

class SkillsSuggestor extends Component {
    constructor() {
        super();

        this.state = {
            suggestions: [],
            value: '',
        };
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }

    static getDerivedStateFromProps(nextProps, previousState) {
        if (nextProps.value === '')
            return { value: '' };
        else
            return null;
    }

    getSuggestions(value) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        const suggestions = inputLength === 0
            ? []
            : this.props.skills.filter(skill => {
                const keep =
                    count < 5 && skill.slice(0, inputLength).toLowerCase() === inputValue;
                if (keep)
                    count += 1;
                return keep;
            });
        return suggestions;
    }

    onChange = (event, { newValue }) => {
        this.setState({ value: newValue });
        this.props.onChange({ target: { value: newValue } });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({ suggestions: this.getSuggestions(value) });
    };

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] });
    };

    renderInputComponent(inputProps) {
        const { classes, inputRef = () => { }, ref, ...other } = inputProps;
        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: node => {
                        ref(node);
                        inputRef(node);
                    },
                    classes: {
                        input: classes.input,
                    },
                }}
                {...other}
            />
        );
    }

    renderSuggestion(suggestion, { query, isHighlighted }) {
        const matches = match(suggestion, query);
        const parts = parse(suggestion, matches);
        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight ? (
                            <span key={String(index)} style={{ fontWeight: 500 }}>
                                {part.text}
                            </span>
                        ) : (
                                <strong key={String(index)} style={{ fontWeight: 300 }}>
                                    {part.text}
                                </strong>
                            );
                    })}
                </div>
            </MenuItem>
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Autosuggest
                    renderInputComponent={this.renderInputComponent}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={(skill) => skill}
                    renderSuggestion={this.renderSuggestion}

                    inputProps={{
                        classes,
                        placeholder: this.props.placeholder,
                        value: this.state.value,
                        onChange: this.onChange,
                    }}
                    theme={{
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                            {options.children}
                        </Paper>
                    )}
                />
            </div>
        );
    }
}

export default withStyles(styles)(SkillsSuggestor);
