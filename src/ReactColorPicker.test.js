/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, createEvent } from '@testing-library/react';

import ReactColorPicker from './ReactColorPicker';

describe('ReactColorPicker', () => {
  const originalHex = '#ff0000';
  const updatedHex = '#00ff00';

  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReactColorPicker />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('color updates when setting hue - mousedown', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');

    // Act
    fireEvent(hueDiv, createEvent.mouseDown(hueDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#ff0000');
  });

  test('color updates when setting hue - mousemove', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');

    // Act
    fireEvent(hueDiv, createEvent.mouseMove(hueDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#ff0000');
  });

  test('color updates when setting saturation/value - mousedown', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.mouseDown(svDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#000000');
  });

  test('color updates when setting saturation/value - mousemove', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.mouseMove(svDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#000000');
  });

  test('color updates when the property changes', () => {
    // Arrange
    const { getByLabelText, rerender } = render(<ReactColorPicker color={originalHex} />);

    // Act
    rerender(<ReactColorPicker color={updatedHex}/>);

    // Assert
    expect(getByLabelText('Hex:').value).toEqual(updatedHex);
  });

  test('color updates when entering new hex and blur', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByLabelText } = render(<ReactColorPicker color={originalHex} onChange={onChange} />);
    const hexInput = getByLabelText('Hex:');

    // Act
    fireEvent.change(hexInput, { target: { value: updatedHex } });
    fireEvent.blur(hexInput);

    // Assert
    expect(onChange).toHaveBeenCalledWith(updatedHex);
  });

  test('color updates when entering new hex and enter', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByLabelText } = render(<ReactColorPicker color={originalHex} onChange={onChange} />);
    const hexInput = getByLabelText('Hex:');

    // Act
    fireEvent.change(hexInput, { target: { value: updatedHex } });
    fireEvent.keyDown(hexInput, { key: 'Enter' });

    // Assert
    expect(onChange).toHaveBeenCalledWith(updatedHex);
  });

  test('color resets when pressing escape on hex', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByLabelText } = render(<ReactColorPicker color={originalHex} onChange={onChange} />);
    const hexInput = getByLabelText('Hex:');

    // Act
    fireEvent.change(hexInput, { target: { value: updatedHex } });
    fireEvent.keyDown(hexInput, { key: 'Escape' });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(hexInput.value).toEqual(originalHex);
  });

  test('color resets when pressing escape on hex (IE)', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByLabelText } = render(<ReactColorPicker color={originalHex} onChange={onChange} />);
    const hexInput = getByLabelText('Hex:');

    // Act
    fireEvent.change(hexInput, { target: { value: updatedHex } });
    fireEvent.keyDown(hexInput, { key: 'Esc' });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(hexInput.value).toEqual(originalHex);
  });

  test('no action if unbound key is pressed on hex', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByLabelText } = render(<ReactColorPicker color={originalHex} onChange={onChange} />);
    const hexInput = getByLabelText('Hex:');

    // Act
    fireEvent.keyDown(hexInput, { key: 'A' });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(hexInput.value).toEqual(originalHex);
  });

  test('null color is sanitized', () => {
    // Arrange
    // Act
    const { getByLabelText } = render(<ReactColorPicker color={null} />);
    const hexInput = getByLabelText('Hex:');

    // Assert
    expect(hexInput.value).toEqual('#000000');
  });

  test('renders without hex', () => {
    // Arrange
    // Act
    const { queryByLabelText } = render(<ReactColorPicker showHex={false} />);
    const hexInput = queryByLabelText('Hex:');

    // Assert
    expect(hexInput).toBeNull();
  });

  test('renders without swatch', () => {
    // Arrange
    // Act
    const { queryByTitle } = render(<ReactColorPicker showSwatch={false} />);
    const swatch = queryByTitle('Swatch');

    // Assert
    expect(swatch).toBeNull();
  });

  test('appends additional className', () => {
    // Arrange
    const testClassName = 'test123';

    // Act
    const { container } = render(<ReactColorPicker className={testClassName} showSwatch={false} />);

    // Assert
    expect(container.firstChild.classList.contains(testClassName)).toBe(true);
  });
});
