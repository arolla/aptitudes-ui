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
        expect(form.state().newSkillName).toBe("skikill");
        addSkill(form);
        expect(form.state().newSkillName).toBe("");
    });
    it('calls onClose() when done', done => {
        fetchMock.post("/employees", 200);
        function onClose() {
            done();
        }
        const form = mount(<AddEmployee onClose={onClose} />);
        submit(form);
    });
    //TODO: verify error is managed
    //TODO: add callBacks onError and onCreation
    it('creates employee on close', done => {
        const employeeService = fetchMock.post("/employees", 200);
        function onClose() {
            console.log(employeeService.calls());
            expect(employeeService.called("/employees")).toBe(true);
            done();
        }
        const form = mount(<AddEmployee onClose={onClose} />);
        submit(form);
    })
});

function addSkill(form) {
    form.find('button[children="Add skill"]')
        .simulate('click', { preventDefault: () => undefined });
}

function setSkillName(form, name) {
    form.find('input[name="newSkillName"]')
        .simulate('change', { target: { value: name } });
}

function submit(form) {
    form.find('[type="submit"]').simulate('submit', { preventDefault: () => undefined });
}
