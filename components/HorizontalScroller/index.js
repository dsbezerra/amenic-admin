import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';

import Arrow from './Arrow';
import {
  StyledHorizontalScroller,
  StyledChild,
  StyledSlider,
} from './StyledHorizontalScroller';

function HorizontalScroller(props) {
  const [left, setLeft] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [advanceBy, setAdvanceBy] = useState(0);
  const [arrows, setArrows] = useState({
    left: false,
    right: false,
  });
  const sliderRef = useRef(null);

  const { children } = props;

  function updateArrows() {
    if (!children) {
      setArrows({ left: false, right: false });
      return;
    }
    const { clientWidth } = sliderRef.current;
    setArrows({ left: left > 0, right: left + clientWidth < itemWidth * children.length });
  }

  function updateAmount() {
    const slider = sliderRef.current;
    if (!slider) {
      throw new Error('HorizontalScroller is missing slider ref');
    }

    if (!slider.children) {
      return;
    }

    // NOTE: all children must have the same width
    const child = slider.children[0];
    if (!child) {
      return;
    }

    const rect = child.getBoundingClientRect();
    if (rect.width) {
      setItemWidth(rect.width);
      setAdvanceBy(Math.round(slider.clientWidth / rect.width) * rect.width);
    }
  }

  useEffect(() => {
    updateArrows();
  }, [itemWidth, advanceBy, left]);

  useLayoutEffect(() => {
    function handleResize() {
      raf(() => { updateAmount(); });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onNext() {
    setLeft(Math.min(left + advanceBy, itemWidth * children.length - sliderRef.current.clientWidth));
  }

  function onPrevious() {
    setLeft(Math.max(0, left - advanceBy));
  }

  return (
    <StyledHorizontalScroller>
      <StyledSlider
        ref={sliderRef}
        style={{
          transform: `translateX(-${left}px)`,
        }}
      >
        {children.map(c => (
          <StyledChild key={c.key}>
            {c}
          </StyledChild>
        ))}
      </StyledSlider>

      {arrows.left && (
        <Arrow
          direction="left"
          onClick={onPrevious}
        />
      )}

      {arrows.right && (
        <Arrow
          direction="right"
          onClick={onNext}
        />
      )}
    </StyledHorizontalScroller>
  );
}

HorizontalScroller.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { HorizontalScroller };
