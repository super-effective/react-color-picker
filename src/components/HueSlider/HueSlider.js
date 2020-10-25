import classNames from 'classnames';
import PropTypes from 'prop-types';
import { hsvToHex } from '@super-effective/colorutils';
import React, { useCallback, useRef, useState } from 'react';

import {
  getHueFromPosition,
  getPagePosition,
} from 'common/util';

import styles from './HueSlider.module.scss';

const HueSlider = ({
  className,
  hue,
  layout,

  onChange,
  onInteractionStart,
  onInteractionEnd,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const sliderDivRef = useRef();

  const hueColor = hsvToHex(hue, 1, 1);

  const updateHue = useCallback((evt) => {
    const huePosition = getPagePosition(sliderDivRef.current);

    switch (layout) {
      case HueSlider.LAYOUTS.VERTICAL: {
        const y = evt.pageY - huePosition.top;
        const updatedHue = getHueFromPosition(y, sliderDivRef.current.clientHeight);
        onChange(updatedHue);
        break;
      }
      default: {
        const x = evt.pageX - huePosition.left;
        const updatedHue = getHueFromPosition(x, sliderDivRef.current.clientWidth);
        onChange(updatedHue);
      }
    }
  }, []);

  const onPointerDown = useCallback((evt) => {
    evt.target.setPointerCapture(evt.pointerId);
    onInteractionStart();
    setIsInteracting(true);
    updateHue(evt);
  }, []);

  const onPointerUp = useCallback((evt) => {
    evt.target.releasePointerCapture(evt.pointerId);
    onInteractionEnd();
    setIsInteracting(false);
  }, []);

  const onMouseDown = useCallback((evt) => {
    onInteractionStart();
    setIsInteracting(true);
    updateHue(evt);
  }, []);

  const onMove = useCallback((evt) => {
    if (isInteracting) {
      updateHue(evt);
    }
  }, [isInteracting]);

  const onMouseUp = useCallback(() => {
    onInteractionEnd();
    setIsInteracting(false);
  }, []);


  // Setup pointer events for supported browsers for two reasons:
  //   1. It allows for pointer capture which allows for continued
  //      interaction even when the cursor/pointer outside of picker
  //   2. It allows for unified code across devices (mobile and desktop)
  const interactionCallbacks = (window.PointerEvent)
    ? {
      onPointerDown,
      onPointerMove: onMove,
      onPointerUp,
    }
    : {
      onMouseDown,
      onMouseMove: onMove,
      onMouseUp,
    };

  const sliderStyle = (layout === HueSlider.LAYOUTS.VERTICAL)
    ? {
      top: `${(hue / 360) * 100}%`,
      backgroundColor: hueColor,
    }
    : {
      left: `${(hue / 360) * 100}%`,
      backgroundColor: hueColor,
    };

  return (
    <div
        className={classNames(
          styles.hue_slider,
          className,
          { [styles.vertical]: layout === HueSlider.LAYOUTS.VERTICAL },
        )}
        ref={sliderDivRef}
        title="Hue"

        {...interactionCallbacks}
    >
      <div
        className={styles.hue_slider_picker}
        style={sliderStyle}
      />
    </div>
  );
};

HueSlider.LAYOUTS = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

HueSlider.propTypes = {
  className: PropTypes.string,
  hue: PropTypes.number.isRequired,
  layout: PropTypes.oneOf(Object.values(HueSlider.LAYOUTS)),

  onChange: PropTypes.func.isRequired,
  onInteractionStart: PropTypes.func,
  onInteractionEnd: PropTypes.func,
};

HueSlider.defaultProps = {
  className: null,
  layout: HueSlider.LAYOUTS.HORIZONTAL,
  onInteractionStart: () => {},
  onInteractionEnd: () => {},
};

export default HueSlider;
