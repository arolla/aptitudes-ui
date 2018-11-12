import React from 'react';
import ReactDOM from 'react-dom';
import Skillz from './Skillz';
import fetchMock from 'fetch-mock';
import {shallow} from 'enzyme';

describe('Skillz', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Skillz />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('fetches stuff', done => {
    const expectedEmployees = [{ name: "Tim Banger", skills: [{ name: "bang" }] }];
    fetchMock.mock("*", expectedEmployees);
    function onMounted() { 
      expect(skillz.state().employees).toEqual(expectedEmployees);
      done();
    }
    const skillz = shallow(<Skillz onMounted={onMounted}/>);
  })
});
