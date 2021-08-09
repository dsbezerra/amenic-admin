import { rgba } from 'polished';

import { deepFreeze } from 'grommet/utils';

import common from './common';

const controlColor = '#FFCA58';

const backgroundColor = '#262626';
const backgroundColors = ['dark-1', 'dark-2', 'dark-3'];

const textColor = '#eee';
const textColors = ['light-5'];

const borderColor = rgba(255, 255, 255, 0.33);
const activeColor = rgba(102, 102, 102, 0.5);

const colors = {
  active: activeColor,
  background: backgroundColor,
  black: '#000000',
  border: borderColor,
  brand: '#262626',
  control: controlColor,
  focus: controlColor,
  placeholder: '#AAAAAA',
  text: textColor,
  icon: textColor,
  white: '#FFFFFF',
};

const colorArray = (array, prefix) => array.forEach((color, index) => {
  colors[`${prefix}-${index + 1}`] = color;
});

colorArray(backgroundColors, 'background');
colorArray(textColors, 'text');

export const dark = deepFreeze({
  global: {
    ...common,
    colors,
    drop: {
      background: '#333333',
    },
    text: {
      dark: textColor,
      light: '#000000',
    },
  },
  layer: {
    background: backgroundColor,
    overlay: {
      background: rgba(48, 48, 48, 0.5),
    },
  },
  icon: {
    color: textColor,
    colors,
  },
});
