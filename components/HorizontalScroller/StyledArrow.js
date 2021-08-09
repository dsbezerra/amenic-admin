import styled from 'styled-components';

const StyledArrow = styled.span`
  position: absolute;
  top: 50%;
  ${props => `${props.direction}: 0;`}
  margin: 0 12px;
  transform: translateY(-50%);
  border-radius: 50%;
  ${props => `${!props.arrow ? 'background-color: rgba(0, 0, 0, 0.5)' : 'none'};`}
`;

export default StyledArrow;
