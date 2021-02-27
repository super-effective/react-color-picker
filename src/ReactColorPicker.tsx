import React, { useEffect, useState, useRef } from 'react';
import { hsvToHex, hexToHsv, sanitizeHex, Hsv } from '@super-effective/colorutils';

import HueSlider from 'components/HueSlider';
import SaturationValueSelector from 'components/SaturationValueSelector';

import styles from './ReactColorPicker.module.scss';

type ReactColorPickerProps = {
  className?: string | null;
  color?: string | null;
  hueClassName?: string;
  huePickerClassName?: string;
  saturationValueClassName?: string;
  saturationValuePickerClassName?: string;
  showHex?: boolean;
  showSwatch?: boolean;

  onChange?: (hex: string) => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
};

const ReactColorPicker = ({
  className = null,
  color = '#3cd6bf',
  hueClassName,
  huePickerClassName,
  saturationValueClassName,
  saturationValuePickerClassName,
  showHex = true,
  showSwatch = true,

  onChange = () => {},
  onInteractionStart = () => {},
  onInteractionEnd = () => {},

  ...rest
}: ReactColorPickerProps) => {
  const sanitizedColor = sanitizeHex(color || '#000000');

  const [hex, setHex] = useState<string>(sanitizedColor);
  const [hsv, setHsv] = useState(hexToHsv(sanitizedColor));
  const [isInteracting, setIsInteracting] = useState(false);

  // Used when editing the hex through the input
  const [tempHex, setTempHex] = useState(hex);

  const hsvRef = useRef(hsv);
  const hexRef = useRef(hex);

  // Set the hex and hsv states/refs with updated data
  const setColor = (updatedHex: string, updatedHsv: Hsv) => {
    hexRef.current = updatedHex;
    hsvRef.current = updatedHsv;

    setHex(updatedHex);
    setTempHex(updatedHex);
    setHsv(updatedHsv);

    onChange(updatedHex);
  };

  // Helper to set the color when HSV change
  const setColorFromHsv = (updatedHsv: Hsv) => setColor(
    hsvToHex(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value),
    updatedHsv,
  );

  // Helper to set the color when hex changes
  const setColorFromHex = (updatedHex: string) => setColor(updatedHex, hexToHsv(updatedHex));

  const onControlInteractionStart = () => {
    setIsInteracting(true);
    onInteractionStart();
  };

  const onControlInteractionEnd = () => {
    setIsInteracting(false);
    onInteractionEnd();
  };


  // Event handler for hex input changes (on blur and enter pressed)
  const onHexChange = (value: string) => {
    // Strip out invalid characters
    const sanitizedHex = sanitizeHex(value);

    setColorFromHex(sanitizedHex);
  };

  // Update color when the passed value changes
  useEffect(() => {
    if (color !== hexRef.current && !isInteracting) {
      const sanitizedHex = sanitizeHex(color || '#000000');
      setColorFromHex(sanitizedHex);
    }
  }, [color]);

  const {
    hue,
    saturation,
    value,
  } = hsv;

  return (
    <div
      className={`${styles.react_color_picker}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      <div className={styles.saturation_value_selector}>
        <SaturationValueSelector
          className={saturationValueClassName}
          pickerClassName={saturationValuePickerClassName}
          hue={hue}
          saturation={saturation}
          value={value}

          onChange={(updatedSaturationValue) => setColorFromHsv({
            ...hsvRef.current,
            ...updatedSaturationValue,
          })}
          onInteractionStart={onControlInteractionStart}
          onInteractionEnd={onControlInteractionEnd}
        />
      </div>

      <HueSlider
        className={hueClassName}
        pickerClassName={huePickerClassName}
        hue={hue}
        onChange={(updatedHue) => setColorFromHsv({
          ...hsvRef.current,
          hue: updatedHue,
        })}
        onInteractionStart={onControlInteractionStart}
        onInteractionEnd={onControlInteractionEnd}
      />

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
                  const inputTarget = evt.target as HTMLInputElement;
                  if (evt.key === 'Enter') {
                    onHexChange(inputTarget.value);
                  } else if (evt.key === 'Esc' || evt.key === 'Escape') {
                    // eslint-disable-next-line no-param-reassign
                    inputTarget.value = hexRef.current;
                    inputTarget.blur();
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

export default ReactColorPicker;
