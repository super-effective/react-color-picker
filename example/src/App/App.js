import React, { useState } from 'react';
import ReactColorPicker from '@super-effective/react-color-picker';

import styles from './App.module.scss';

const App = () => {
  const [color, setColor] = useState('#3cd6bf');

  const onColorChange = (updatedColor) => {
    setColor(updatedColor);
  };

  return (
    <div className={styles.app}>
      <h1>
        Selected color:
        {color}
      </h1>
      <div className={styles.color_picker}>
        <ReactColorPicker color={color} onChange={onColorChange} />
      </div>
    </div>
  );
};

export default App;
