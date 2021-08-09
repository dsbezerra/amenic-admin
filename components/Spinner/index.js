import styled from 'styled-components';

const SIZES = [
  'xsmall', 'small', 'medium', 'large',
];

const getSize = (size) => {
  let px = 24;

  switch (size) {
    case 'xsmall':
      px = 16;
      break;

    case 'small':
      px = 32;
      break;

    case 'large':
      px = 48;
      break;

    default:
      px = 24;
  }

  return `
    width: ${px}px;
    height: ${px}px;
  `;
};

const getBorderSize = (size) => {
  switch (size) {
    case 'xsmall':
      return 2;

    case 'small':
      return 3;

    case 'large':
      return 6;

    default:
      return 5;
  }
};

const StyledSpinner = styled.div`
  display: inline-block;
  ${props => getSize(props.size)}

  &:after {
    content: " ";
    display: block;
    ${props => getSize(props.size)}
    margin: 2px;
    border-radius: 50%;
    border: ${props => `${getBorderSize(props.size)}px solid ${props.color ? props.color : '#fff'}`};
    border-color: ${props => `${props.color ? `${props.color} transparent ${props.color} transparent` : '#fff transparent #fff transparent'}`};
    animation: spinner 1.2s linear infinite;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = props => (
  <StyledSpinner {...props} />
);

export { Spinner };
