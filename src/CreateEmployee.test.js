import React from 'react';
import CreateEmployee from './CreateEmployee';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';

describe('CreateEmployee', () => {
    beforeEach(() => {
        fetchMock.get("/skills", []);
    })
    afterEach(() => {
        fetchMock.reset();
    });

    it('starts with an empty name', () => {
        const form = shallow(<CreateEmployee />);
        expect(form.state().name).toBe("");
    });

    it('adds skill', () => {
        const form = shallow(<CreateEmployee />);
        setNewSkillName(form, "skikill");
        setNewSkillLevel(form, "1");
        addSkill(form);
        expect(form.find('.skillName').map(label => label.text())).toEqual(["skikill"]);
        expect(form.find('.skillLevel').map(label => label.text())).toEqual(["1"]);
    });

    it('resets newSkillName when added', () => {
        const form = shallow(<CreateEmployee />);
        setNewSkillName(form, "skikill");
        setNewSkillLevel(form, "2");
        expect(getNewSkillName(form)).toBe("skikill");
        expect(getNewSkillLevel(form)).toBe("2");
        addSkill(form);
        expect(getNewSkillName(form)).toBe("");
        expect(getNewSkillLevel(form)).toBe("");
    });

    it('creates employee on submit', done => {
        const expectedEmployee = /{"id":".*","name":"Bond","skills":\[{"name":"alcohol","level":"2"}\]}/;

        const employeeService = fetchMock.post("/employees", 200);
        function onCreated() {
            expect(employeeService.lastOptions().body).toMatch(expectedEmployee);
            done();
        }

        const form = mount(<CreateEmployee onCreated={onCreated} />);
        setEmployeeName(form, "Bond");
        setNewSkillName(form, "alcohol");
        setNewSkillLevel(form, "2");
        addSkill(form);
        submit(form);
    });

    it('handles employee creation service errors', done => {
        fetchMock.post("/employees", 500);
        function onError() {
            done();
        }
        const form = mount(<CreateEmployee onError={onError} />);
        submit(form);
    });

    [-1, 4].forEach(level => {
        it(`rejects out of bounds skill level $level`, () => {
            const form = shallow(<CreateEmployee />);
            setNewSkillLevel(form, level);
            expect(getNewSkillLevel(form)).toBe("");
        });
    });

    [0, 1, 2, 3].forEach(level => {
        it(`accepts valid skill level $level`, () => {
            const form = shallow(<CreateEmployee />);
            setNewSkillLevel(form, level);
            expect(getNewSkillLevel(form)).toBe(level);
        });
    });
});

function addSkill(form) {
    form.find('#addSkill').first()
        .simulate('click', { preventDefault: () => undefined });
}
function getNewSkillName(form) {
    return form.find('SkillsSuggestor').prop('value');
}
function setNewSkillName(form, name) {
    form.find('SkillsSuggestor')
        .props().onChange({ target: { value: name } });
}
function getNewSkillLevel(form) {
    return form.find('TextField[name="newSkillLevel"]').prop('value');
}
function setNewSkillLevel(form, level) {
    form.find('TextField[name="newSkillLevel"]')
        .props().onChange({ target: { value: level } });
}
function setEmployeeName(form, name) {
    form.find('TextField[name="employeeName"]')
        .props().onChange({ target: { value: name } });
}
function submit(form) {
    form.find('[type="submit"]').first()
        .simulate('submit', { preventDefault: () => undefined });
}
