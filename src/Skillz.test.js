import React from 'react';
import ReactDOM from 'react-dom';
import Skillz from './Skillz';
import fetchMock from 'fetch-mock';
import { shallow } from 'enzyme';

describe('Skillz', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Skillz />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fetches stuff', done => {
    const expectedEmployees = [{ name: "Tim Banger", skills: [{ name: "bang", level: "1" }] }];
    const employeesService = fetchMock.mock("/employees", expectedEmployees);
    function onRefreshed() {
      expect(employeesService.called("/employees")).toBe(true);
      expect(skillz.state().employees).toEqual(expectedEmployees);
      done();
    }
    const skillz = shallow(<Skillz onRefreshed={onRefreshed} />);
  })

  it('refreshes employees list when employee added', done => {
    const expectedEmployees = [{ name: "Johnny Cash", skills: [{ name: "benefits", level: "2" }] }];
    fetchMock.mock("/employees", []);
    let skillz;
    let initializing = true;
    function onRefreshed() {
      if (initializing) {
        fetchMock.mock("/employees", expectedEmployees, { overwriteRoutes: true });
        simulateOnAdded(skillz);
        initializing = false;
      } else {
        expect(skillz.state().employees).toEqual(expectedEmployees);
        done();
      }
    }
    skillz = shallow(<Skillz onRefreshed={onRefreshed} />);
  })

  it('displays message when employee created', () => {
    const skillz = shallow(<Skillz />);
    simulateOnAdded(skillz);
    expect(skillz.find('.message').text()).toEqual("employee added");
  })

  it('displays error when employee creation failed', () => {
    const skillz = shallow(<Skillz />);
    simulateOnError(skillz);
    expect(skillz.find('.error').text()).toMatch(/^employee creation failed.*/);
  })

  it('resets error on message', () => {
    const skillz = shallow(<Skillz />);
    simulateOnError(skillz);
    simulateOnAdded(skillz);
    expect(skillz.find('.error').text()).toEqual("");
  })

  it('resets message on error', () => {
    const skillz = shallow(<Skillz />);
    simulateOnAdded(skillz);
    simulateOnError(skillz);
    expect(skillz.find('.message').text()).toEqual("");
  })

  function simulateOnAdded(skillz) {
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onAdded')();
  }

  function simulateOnError(skillz) {
    skillz.find('button').simulate('click');
    skillz.find("AddEmployee").prop('onError')();
  }
});
