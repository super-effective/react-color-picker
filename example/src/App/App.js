import React, { useState } from 'react';
import ReactColorPicker, { HueSlider, SaturationValueSelector } from '@super-effective/react-color-picker';
import { hsvToHex } from '@super-effective/colorutils';

import styles from './App.module.scss';

const App = () => {
  const [color, setColor] = useState('#3cd6bf');
  const [isInteracting, setIsInteracting] = useState(false);

  // Hue slider example
  const [hue, setHue] = useState(171.03896103896102);
  const [saturation, setSaturation] = useState(0.7196261682242991);
  const [value, setValue] = useState(0.8392156862745098);

  const hex = hsvToHex(hue, saturation, value);

  const onColorChange = (updatedColor) => {
    setColor(updatedColor);
  };

  const onInteractionStart = () => {
    setIsInteracting(true);
  };

  const onInteractionEnd = () => {
    setIsInteracting(false);
  };

  return (
    <div className={styles.app}>
      <section>
        <h1>
          Selected color:
          {color}
        </h1>
        <p>
          Is interacting?
          &nbsp;
          {isInteracting ? 'Yes' : 'No'}
        </p>
        <div className={styles.color_picker}>
          <ReactColorPicker
            color={color}
            onChange={onColorChange}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </section>

      <section>
        <h1>
          Hue:
          {Math.round(hue * 100) / 100}
        </h1>
        <div className={styles.hue_slider}>
          <HueSlider
            hue={hue}
            onChange={(updatedHue) => setHue(updatedHue)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </section>

      <section>
        <h1>
          Hue:
          {Math.round(hue * 100) / 100}
        </h1>
        <div className={styles.hue_slider_vertical}>
          <HueSlider
            hue={hue}
            layout={HueSlider.LAYOUTS.VERTICAL}
            onChange={(updatedHue) => setHue(updatedHue)}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
      </section>

      <section>
        <h1>
          Saturation:
          {Math.round(saturation * 10000) / 100}
          <br />
          Value:
          {Math.round(value * 10000) / 100}
        </h1>
        <div className={styles.saturation_value}>
          <SaturationValueSelector
            hue={hue}
            saturation={saturation}
            value={value}
            onChange={({ saturation: updatedSaturation, value: updatedValue }) => {
              setSaturation(updatedSaturation);
              setValue(updatedValue);
            }}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
          />
        </div>
        <h2>
          Hex:
          {hex}
        </h2>
      </section>
    </div>
  );
};

export default App;
