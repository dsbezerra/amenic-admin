import { Next, Previous } from 'grommet-icons';
import { Button } from 'grommet';

import StyledArrow from './StyledArrow';

const Arrow = ({ arrow, onNext, onPrevious, ...props }) => (
  <StyledArrow arrow={arrow} {...props}>
    {!arrow ? (
      <Button
        icon={props.direction === 'right' ?
          <Next color="light-1" /> :
          <Previous color="light-1" />
        }
        onClick={props.direction === 'right' ? onNext : onPrevious}
      />)
      : arrow}
  </StyledArrow>
);

// TODO: add propTypes

export default Arrow;
