import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import EmployeeService from './EmployeeService';

class SkillsSuggestor extends Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            skills: [],
        };
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }

    componentDidMount() {
        EmployeeService.skills()
            .then(skills => this.setState({ skills }))
            .catch(err => this.props.onError(err));
    }

    getSuggestions(value) {
        const escapedValue = escapeRegexCharacters(value.trim());
        if (escapedValue === '')
            return [];
        const regex = new RegExp(escapedValue, 'i');
        const skillsToDisplay = this.state.skills.filter(skill => {
            return regex.test(skill);
        });
        return skillsToDisplay
    }

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
        this.props.onChange({ target: { value: newValue } });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { suggestions } = this.state;
        const inputProps = {
            placeholder: "Skill Name",
            value: this.props.value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={(skill) => <span>{skill}</span>}
                inputProps={inputProps} />
        );
    }
}

function escapeRegexCharacters(str) {
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(skill) {
    return skill;
}
export default SkillsSuggestor;
