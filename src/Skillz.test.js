import React from 'react';
import ReactDOM from 'react-dom';
import Skillz from './Skillz';
// import fetchMock from 'fetch-mock';
// import Enzyme, {shallow} from 'Enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// Enzyme.configure({adapter: new Adapter()});


describe('Skillz', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Skillz />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // it('fetches stuff', () => {
  //   fetchMock.mock("*", {go: "fuck yourself"});
  //   const skillz = shallow(<Skillz/>);
  // })
});
