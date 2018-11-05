import React from 'react';
import ReactDOM from 'react-dom';
import Skillz from './Skillz';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Skillz />, div);
  ReactDOM.unmountComponentAtNode(div);
});
