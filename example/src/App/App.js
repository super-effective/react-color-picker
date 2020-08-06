import React, { useState } from 'react';
import ReactColorPicker from '@super-effective/react-color-picker';

import styles from './App.module.scss';

const App = () => {
  const [color, setColor] = useState('#3cd6bf');
  const [isInteracting, setIsInteracting] = useState(false);

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
    </div>
  );
};

export default App;
