import classNames from 'classnames';
import { hsvToHex } from '@super-effective/colorutils';
import React, { useCallback, useRef, useState } from 'react';

import {
  getSaturationValueFromPosition,
  SaturationValue,
} from 'common/util';

import styles from './SaturationValueSelector.module.scss';

type SaturationValueSelectorProps = {
  className?: string;
  hue: number;
  saturation: number;
  value: number;

  onChange: (saturationValue: SaturationValue) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
};

const SaturationValueSelector = ({
  className,
  hue,
  saturation,
  value,

  onChange,
  onInteractionStart = () => {},
  onInteractionEnd = () => {},
}: SaturationValueSelectorProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const selectorDivRef = useRef<HTMLDivElement>(null);

  const hueColor = hsvToHex(hue, 1, 1);
  const hex = hsvToHex(hue, saturation, value);

  const updateSaturationValue = useCallback((
      evt: React.MouseEvent<Element, MouseEvent> | React.PointerEvent<Element>
  ) => {
    if (!selectorDivRef.current) {
      return;
    }

    const svPosition = selectorDivRef.current.getBoundingClientRect();
    const x = evt.clientX - svPosition.left;
    const y = evt.clientY - svPosition.top;

    const updatedSaturationValue = getSaturationValueFromPosition(
      x,
      y,
      selectorDivRef.current.clientWidth,
      selectorDivRef.current.clientHeight,
    );

    onChange(updatedSaturationValue);
  }, [onChange]);

  const onPointerDown = useCallback((evt: React.PointerEvent<Element>): void => {
    (evt.target! as HTMLElement).setPointerCapture(evt.pointerId);
    onInteractionStart();
    setIsInteracting(true);
    updateSaturationValue(evt);
  }, [onInteractionStart, updateSaturationValue]);

  const onPointerUp = useCallback((evt: React.PointerEvent<Element>): void => {
    (evt.target! as HTMLElement).releasePointerCapture(evt.pointerId);
    onInteractionEnd();
    setIsInteracting(false);
  }, [onInteractionEnd]);

  const onMouseDown = useCallback((evt: React.MouseEvent<Element, MouseEvent>): void => {
    onInteractionStart();
    setIsInteracting(true);
    updateSaturationValue(evt);
  }, [onInteractionStart, updateSaturationValue]);

  const onMove = useCallback((evt: React.MouseEvent<Element, MouseEvent> | React.PointerEvent<Element>): void => {
    if (isInteracting) {
      updateSaturationValue(evt);
    }
  }, [isInteracting, updateSaturationValue]);

  const onMouseUp = useCallback((): void => {
    onInteractionEnd();
    setIsInteracting(false);
  }, [onInteractionEnd]);


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

export default SaturationValueSelector;
