import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { hsvToHex, hexToHsv, sanitizeHex } from '@super-effective/colorutils';

import {
  getHueFromPosition,
  getPagePosition,
  getSaturationValueFromPosition,
  isRefTargeted,
} from 'common/util';

import styles from './ReactColorPicker.module.scss';

const ReactColorPicker = ({
  className,
  color,
  showHex,
  showSwatch,

  onChange,

  ...rest
}) => {
  const sanitizedColor = sanitizeHex(color || '#000000');

  const [hex, setHex] = useState(sanitizedColor);
  const [hsv, setHsv] = useState(hexToHsv(sanitizedColor));

  // Used when editing the hex through the input
  const [tempHex, setTempHex] = useState(hex);

  const hsvRef = useRef(hsv);
  const hexRef = useRef(hex);

  const hueSliderRef = useRef();
  const svSliderRef = useRef();


  // Set the hex and hsv states/refs with updated data
  const setColor = (updatedHex, updatedHsv) => {
    hexRef.current = updatedHex;
    hsvRef.current = updatedHsv;

    setHex(updatedHex);
    setTempHex(updatedHex);
    setHsv(updatedHsv);

    onChange(updatedHex);
  };

  // Helper to set the color when HSV change
  const setColorFromHsv = (updatedHsv) => {
    setColor(
      hsvToHex(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value),
      updatedHsv,
    );
  };

  // Helper to set the color when hex changes
  const setColorFromHex = (updatedHex) => {
    setColor(updatedHex, hexToHsv(updatedHex));
  };


  // Event handler for hex input changes (on blur and enter pressed)
  const onHexChange = (value) => {
    // Strip out invalid characters
    const sanitizedHex = sanitizeHex(value);

    setColorFromHex(sanitizedHex);
  };

  // Update color when the passed value changes
  useEffect(() => {
    if (color !== hexRef.current) {
      const sanitizedHex = sanitizeHex(color || '#000000');
      setColorFromHex(sanitizedHex);
    }
  }, [color]);


  // Hookup cursor events to update the color selection
  useEffect(() => {
    const updateColor = (evt) => {
      // Update hue if targeted
      if (isRefTargeted(evt, hueSliderRef) && evt.buttons === 1) {
        const huePosition = getPagePosition(hueSliderRef.current);
        const x = evt.pageX - huePosition.left;

        const updatedHue = getHueFromPosition(x, hueSliderRef.current.clientWidth);

        setColorFromHsv({ ...hsvRef.current, hue: updatedHue });
      }

      // Update the saturation/value if targeted
      if (isRefTargeted(evt, svSliderRef) && evt.buttons === 1) {
        const svPosition = getPagePosition(svSliderRef.current);
        const x = evt.pageX - svPosition.left;
        const y = evt.pageY - svPosition.top;

        const updatedSaturationValue = getSaturationValueFromPosition(
          x,
          y,
          svSliderRef.current.clientWidth,
          svSliderRef.current.clientHeight,
        );

        setColorFromHsv({
          ...hsvRef.current,
          ...updatedSaturationValue,
        });
      }
    };

    document.addEventListener('mousedown', updateColor);
    document.addEventListener('mousemove', updateColor);

    return () => {
      document.removeEventListener('mousedown', updateColor);
      document.removeEventListener('mousemove', updateColor);
    };
  }, []);

  const {
    hue,
    saturation,
    value,
  } = hsv;

  // Get the hex for the hue slider
  const hueColor = hsvToHex(hue, 1, 1);

  return (
    <div
      className={`${styles.react_color_picker}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      <div
          className={styles.saturation_value}
          style={{
            backgroundColor: hueColor,
          }}
          ref={svSliderRef}
          title="Saturation and Value"
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

        <div className={styles.hue_slider} ref={hueSliderRef} title="Hue" >
          <div
            className={styles.hue_slider_picker}
            style={{
              left: `${(hue / 360) * 100}%`,
              backgroundColor: hueColor,
            }}
          />
        </div>

        {(showHex || showSwatch) && (
          <div className={styles.details}>
            {showSwatch && (
              <div
                className={styles.swatch}
                style={{
                  backgroundColor: hex,
                }}
                title="Swatch"
              />
            )}
            {showHex && (
              <label>
                <span>Hex:</span>
                <input
                  className={styles.hex_value}
                  value={tempHex}
                  onChange={(evt) => setTempHex(evt.target.value)}
                  onBlur={(evt) => onHexChange(evt.target.value)}
                  onKeyDown={(evt) => {
                    if (evt.key === 'Enter') {
                      onHexChange(evt.target.value);
                    } else if (evt.key === 'Esc' || evt.key === 'Escape') {
                      // eslint-disable-next-line no-param-reassign
                      evt.target.value = hexRef.current;
                      evt.target.blur();
                    }
                  }}
                />
              </label>
            )}
          </div>
        )}
    </div>
  );
};

ReactColorPicker.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  showSwatch: PropTypes.bool,
  showHex: PropTypes.bool,

  onChange: PropTypes.func,
};

ReactColorPicker.defaultProps = {
  className: null,
  color: '#3cd6bf',
  showSwatch: true,
  showHex: true,

  onChange: () => {},
};

export default ReactColorPicker;
