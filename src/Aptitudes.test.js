import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Aptitudes from './Aptitudes';
import fetchMock from 'fetch-mock';
import { shallow } from 'enzyme';

describe('Aptitudes', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Aptitudes />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fetches stuff', done => {
    const expectedEmployees = [{ name: "Tim Banger", skills: [{ name: "bang", level: "1" }] }];
    const employeesService = fetchMock.mock("/employees", expectedEmployees);
    function onRefreshed() {
      expect(employeesService.called("/employees")).toBe(true);
      expect(aptitudes.state().employees).toEqual(expectedEmployees);
      done();
    }
    const aptitudes = shallow(<Aptitudes onRefreshed={onRefreshed} />);
  })

  it('refreshes employees list when employee added', done => {
    const expectedEmployees = [{ name: "Johnny Cash", skills: [{ name: "benefits", level: "2" }] }];
    fetchMock.mock("/employees", []);
    let aptitudes;
    let initializing = true;
    function onRefreshed() {
      if (initializing) {
        fetchMock.mock("/employees", expectedEmployees, { overwriteRoutes: true });
        simulateOnAdded(aptitudes);
        initializing = false;
      } else {
        expect(aptitudes.state().employees).toEqual(expectedEmployees);
        done();
      }
    }
    aptitudes = shallow(<Aptitudes onRefreshed={onRefreshed} />);
  })

  it('displays message when employee created', () => {
    const aptitudes = shallow(<Aptitudes />);
    simulateOnAdded(aptitudes);
    expect(aptitudes.find('.message').text()).toEqual("employee added");
  })

  it('displays error when employee creation failed', () => {
    const aptitudes = shallow(<Aptitudes />);
    simulateOnError(aptitudes);
    expect(aptitudes.find('.error').text()).toMatch(/^employee creation failed.*/);
  })

  it('resets error on message', () => {
    const aptitudes = shallow(<Aptitudes />);
    simulateOnError(aptitudes);
    simulateOnAdded(aptitudes);
    expect(aptitudes.find('.error').text()).toEqual("");
  })

  it('resets message on error', () => {
    const aptitudes = shallow(<Aptitudes />);
    simulateOnAdded(aptitudes);
    simulateOnError(aptitudes);
    expect(aptitudes.find('.message').text()).toEqual("");
  })

  function simulateOnAdded(aptitudes) {
    aptitudes.find(Button).simulate('click');
    aptitudes.find("AddEmployee").prop('onAdded')();
  }

  function simulateOnError(aptitudes) {
    aptitudes.find(Button).simulate('click');
    aptitudes.find("AddEmployee").prop('onError')();
  }
});
