import { rgba } from 'polished';
import { deepFreeze } from 'grommet/utils';

import common from './common';

const backgroundColor = 'light';
const backgroundColors = ['light-1', 'light-2', 'light-3'];

const textColor = '#000';
const textColors = ['dark-5'];

const borderColor = rgba(0, 0, 0, 0.05);
const controlColor = rgba(0, 0, 0, 0.5);

const colors = {
  control: controlColor,
  border: borderColor,
  brand: '#fff',
  background: backgroundColor,
  text: textColor,
  icon: textColor,
  focus: '#33bffc',
};

const colorArray = (array, prefix) => array.forEach((color, index) => {
  colors[`${prefix}-${index + 1}`] = color;
});

colorArray(backgroundColors, 'background');
colorArray(textColors, 'text');

export const light = deepFreeze({
  global: {
    ...common,
    colors,
  },
});
