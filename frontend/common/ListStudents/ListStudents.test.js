import React from 'react';
import { shallow } from 'enzyme';
import ListStudents from './ListStudents';

test('renders without crashing', () => {
  fetch.mockResponseOnce(JSON.stringify([]));
  const listStudents = shallow(<ListStudents />);
});
