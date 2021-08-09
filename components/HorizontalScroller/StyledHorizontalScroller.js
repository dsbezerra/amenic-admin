import styled from 'styled-components';

export const StyledSlider = styled.div.attrs({
  style: ({ transform }) => ({
    transform,
  }),
})`
  transition: transform 300ms ease;
`;

export const StyledChild = styled.div`
  display: inline-block;
`;

export const StyledHorizontalScroller = styled.div`
  position: relative;
  overflow: hidden;
  white-space: nowrap;
`;
