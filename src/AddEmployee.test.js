import React from 'react';
import AddEmployee from './AddEmployee';
import { shallow, mount } from 'enzyme';
import fetchMock from 'fetch-mock';

describe('AddEmployee', () => {
    afterEach(() => {
        fetchMock.reset();
    });
    
    it('starts with an empty name', () => {
        const form = shallow(<AddEmployee />);
        expect(form.state().name).toBe("");
    });

    it('adds skill', () => {
        const form = shallow(<AddEmployee />);
        setSkillName(form, "skikill");
        addSkill(form);
        expect(form.find('.skillName').map(label => label.text())).toEqual(["skikill"]);
    });

    it('resets newSkillName when added', () => {
        const form = shallow(<AddEmployee />);
        setSkillName(form, "skikill");
        expect(form.find('input[name="newSkillName"]').prop('value')).toBe("skikill");
        addSkill(form);
        expect(form.find('input[name="newSkillName"]').prop('value')).toBe("");
    });

    it('creates employee on submit', done => {
        const expectedEmployee = { name: "Bond", skills: [{ name: "alcohol", level: "2" }] };
 
        const employeeService = fetchMock.post("/employees", 200);
        function onAdded() {
            expect(employeeService.lastOptions().body).toEqual(JSON.stringify(expectedEmployee));
            done();
        }
 
        const form = mount(<AddEmployee onAdded={onAdded} />);
        setEmployeeName(form, "Bond");
        setSkillName(form, "alcohol");
        setSkillLevel(form, "2");
        addSkill(form);
        submit(form);
    });

    it('handles employee creation service errors', done => {
        fetchMock.post("/employees", 500);
        function onError() {
            done();
        }
        const form = mount(<AddEmployee onError={onError} />);
        submit(form);
    });

    [-1, 4].forEach(level => {
        it(`rejects out of bounds skill level $level`, () => {
            const form = shallow(<AddEmployee />);
            setSkillLevel(form, level);
            expect(form.find('input[name="newSkillLevel"]').prop('value')).toBe("");
        });
    });

    [0, 1, 2, 3].forEach(level => {
        it(`accepts valid skill level $level`, () => {
            const form = shallow(<AddEmployee />);
            setSkillLevel(form, level);
            expect(form.find('input[name="newSkillLevel"]').prop('value')).toBe(level);
        });
    });
});

function addSkill(form) {
    form.find('button[children="Add skill"]')
        .simulate('click', { preventDefault: () => undefined });
}
function setSkillName(form, name) {
    form.find('input[name="newSkillName"]')
        .simulate('change', { target: { value: name } });
}
function setSkillLevel(form, level) {
    form.find('input[name="newSkillLevel"]')
        .simulate('change', { target: { value: level } });
}
function setEmployeeName(form, name) {
    form.find('input[name="name"]')
        .simulate('change', { target: { value: name } });
}
function submit(form) {
    form.find('[type="submit"]').simulate('submit', { preventDefault: () => undefined });
}
