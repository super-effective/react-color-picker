import classNames from 'classnames';
import PropTypes from 'prop-types';
import { hsvToHex } from '@super-effective/colorutils';
import React, { useCallback, useRef, useState } from 'react';

import {
  getPagePosition,
  getSaturationValueFromPosition,
} from 'common/util';

import styles from './SaturationValueSelector.module.scss';

const SaturationValueSelector = ({
  className,
  hue,
  saturation,
  value,

  onChange,
  onInteractionStart,
  onInteractionEnd,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const selectorDivRef = useRef();

  const hueColor = hsvToHex(hue, 1, 1);
  const hex = hsvToHex(hue, saturation, value);

  const updateSaturationValue = useCallback((evt) => {
    const svPosition = getPagePosition(selectorDivRef.current);
    const x = evt.pageX - svPosition.left;
    const y = evt.pageY - svPosition.top;

    const updatedSaturationValue = getSaturationValueFromPosition(
      x,
      y,
      selectorDivRef.current.clientWidth,
      selectorDivRef.current.clientHeight,
    );

    onChange(updatedSaturationValue);
  }, []);

  const onPointerDown = useCallback((evt) => {
    evt.target.setPointerCapture(evt.pointerId);
    onInteractionStart();
    setIsInteracting(true);
    updateSaturationValue(evt);
  }, []);

  const onPointerUp = useCallback((evt) => {
    evt.target.releasePointerCapture(evt.pointerId);
    onInteractionEnd();
    setIsInteracting(false);
  }, []);

  const onMouseDown = useCallback((evt) => {
    onInteractionStart();
    setIsInteracting(true);
    updateSaturationValue(evt);
  }, []);

  const onMove = useCallback((evt) => {
    if (isInteracting) {
      updateSaturationValue(evt);
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

  return (
    <div
      className={classNames(
        styles.saturation_value_selector,
        className,
      )}
      style={{
        backgroundColor: hueColor,
      }}
      ref={selectorDivRef}
      title="Saturation and Value"

      {...interactionCallbacks}
    >
      <div
        className={styles.saturation_value_picker}
        style={{
          left: `${saturation * 100}%`,
          top: `${(1 - value) * 100}%`,
          backgroundColor: hex,
        }}
      />
    </div>
  );
};

SaturationValueSelector.propTypes = {
  className: PropTypes.string,
  hue: PropTypes.number.isRequired,
  saturation: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,

  onChange: PropTypes.func.isRequired,
  onInteractionStart: PropTypes.func,
  onInteractionEnd: PropTypes.func,
};

SaturationValueSelector.defaultProps = {
  className: null,
  onInteractionStart: () => {},
  onInteractionEnd: () => {},
};

export default SaturationValueSelector;
