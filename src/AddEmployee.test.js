import React from 'react';
import AddEmployee from './AddEmployee';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

describe('AddEmployee', () => {
    it('starts with an empty name', () => {
        const form = shallow(<AddEmployee/>);
        expect(form.state().name).toBe("");
    });
    it('adds skill', () => {
        const form = shallow(<AddEmployee/>);
        form.find('input[name="newSkillName"]')
            .simulate('change', {target: {value: "skikill"}});
        form.find('button[children="Add skill"]')
            .simulate('click', {preventDefault: () => undefined});
        expect(form.find('.skillName').map(label => label.text())).toEqual(["skikill"]);
    });
    it('resets newSkillName when added', () => {
        const form = shallow(<AddEmployee/>);
        form.find('input[name="newSkillName"]')
            .simulate('change', {target: {value: "skikill"}});
        expect(form.state().newSkillName).toBe("skikill");
        form.find('button[children="Add skill"]')
            .simulate('click', {preventDefault: () => undefined});
        expect(form.state().newSkillName).toBe("");
    });
    it('calls onClose() when done', () => {
        const onClose = jest.fn();
        const form = mount(<AddEmployee onClose={onClose}/>);
        form.find('[type="submit"]').simulate('submit', {preventDefault: () => undefined});
        expect(onClose).toHaveBeenCalled();
    });
});