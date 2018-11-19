import React from 'react';
import ReactDOM from 'react-dom';
import Skillz from './Skillz';
import fetchMock from 'fetch-mock';
import { shallow } from 'enzyme';

describe('Skillz', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Skillz />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fetches stuff', done => {
    const expectedEmployees = [{ name: "Tim Banger", skills: [{ name: "bang" }] }];
    const employeesService = fetchMock.mock("/employees", expectedEmployees);
    function onRefreshed() {
      expect(employeesService.called("/employees")).toBe(true);
      expect(skillz.state().employees).toEqual(expectedEmployees);
      done();
    }
    const skillz = shallow(<Skillz onRefreshed={onRefreshed} />);
  })

  it('displays message when employee created', () => {
    const skillz = shallow(<Skillz />);
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onAdded')();
    expect(skillz.find('.message').text()).toEqual("employee added");
  })

  it('displays error when employee creation failed', () => {
    const skillz = shallow(<Skillz />);
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onError')();
    expect(skillz.find('.error').text()).toMatch(/^employee creation failed.*/);
  })

  it('resets error on message', () => {
    const skillz = shallow(<Skillz />);
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onError')();
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onAdded')();
    expect(skillz.find('.error').text()).toEqual("");
  })

  it('resets message on error', () => {
    const skillz = shallow(<Skillz />);
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onAdded')();
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onError')();
    expect(skillz.find('.message').text()).toEqual("");
  })
});
