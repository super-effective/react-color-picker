import classNames from 'classnames';
import { hsvToHex } from '@super-effective/colorutils';
import React, { useCallback, useRef, useState } from 'react';

import {
  getHueFromPosition,
} from 'common/util';

import styles from './HueSlider.module.scss';

type HueSliderProps = {
  className?: string
  hue: number;
  layout?: 'HORIZONTAL' | 'HORIZONTAL';

  onChange: (hue: number) => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
};

const HueSlider = ({
  className,
  hue,
  layout = 'HORIZONTAL',

  onChange,
  onInteractionStart = () => {},
  onInteractionEnd = () => {},
}: HueSliderProps) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const hueColor = hsvToHex(hue, 1, 1);

  const updateHue = useCallback((
    evt: React.MouseEvent<Element, MouseEvent> | React.PointerEvent<Element>
  ) => {
    if (!sliderDivRef.current) {
      return;
    }

    const huePosition = sliderDivRef.current.getBoundingClientRect();

    switch (layout) {
      case HueSlider.LAYOUTS.VERTICAL: {
        const y = evt.clientY - huePosition.top;
        const updatedHue = getHueFromPosition(y, sliderDivRef.current.clientHeight);
        onChange(updatedHue);
        break;
      }
      default: {
        const x = evt.clientX - huePosition.left;
        const updatedHue = getHueFromPosition(x, sliderDivRef.current.clientWidth);
        onChange(updatedHue);
      }
    }
  }, [onChange]);

  const onPointerDown = useCallback((evt: React.PointerEvent<Element>): void => {
    (evt.target! as HTMLElement).setPointerCapture(evt.pointerId);
    onInteractionStart();
    setIsInteracting(true);
    updateHue(evt);
  }, [onInteractionStart, updateHue]);

  const onPointerUp = useCallback((evt: React.PointerEvent<Element>): void => {
    (evt.target! as HTMLElement).releasePointerCapture(evt.pointerId);
    onInteractionEnd();
    setIsInteracting(false);
  }, [onInteractionEnd]);

  const onMouseDown = useCallback((evt: React.MouseEvent<Element, MouseEvent>): void => {
    onInteractionStart();
    setIsInteracting(true);
    updateHue(evt);
  }, [onInteractionStart, updateHue]);

  const onMove = useCallback((evt: React.MouseEvent<Element, MouseEvent> | React.PointerEvent<Element>): void => {
    if (isInteracting) {
      updateHue(evt);
    }
  }, [isInteracting, updateHue]);

  const onMouseUp = useCallback(() => {
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

export default HueSlider;
