import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, createEvent } from '@testing-library/react';

import ReactColorPicker from './ReactColorPicker';

class MockPointerEvent extends MouseEvent {
  width = 1;
  height = 1;
  isPrimary = true;
  pointerId = 1;
  pointerType = 'mouse';
  pressure = 1;
  tangentialPressure = 1;
  tiltX = 0;
  tiltY = 0;
  twist = 0;
}


describe('ReactColorPicker - General', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReactColorPicker />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('ReactColorPicker - Pointer Events', () => {
  test('fires interaction start - hue pointerdown', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const hueDiv = getByTitle('Hue');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(hueDiv, createEvent.pointerDown(hueDiv, { buttons: 1, target }));

    // Assert
    expect(onInteractionStart).toHaveBeenCalled();
    // window.PointerEvent = null;
  });

  test('fires interaction start - saturation/value pointerdown', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const svDiv = getByTitle('Saturation and Value');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(svDiv, createEvent.pointerDown(svDiv, { buttons: 1, target }));

    // Assert
    expect(onInteractionStart).toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });

  test('does not fire interaction start - not targeted', () => {
    window.PointerEvent = MockPointerEvent;
    // Arrange
    const onInteractionStart = jest.fn();
    render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);

    // Act
    fireEvent(document, createEvent.pointerDown(document, { buttons: 1 }));

    // Assert
    expect(onInteractionStart).not.toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });

  test('fires interaction end - pointerup', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onInteractionEnd = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionEnd={onInteractionEnd} />);
    const svDiv = getByTitle('Saturation and Value');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(svDiv, createEvent.pointerDown(svDiv, { buttons: 1, target }));
    fireEvent(svDiv, createEvent.pointerUp(svDiv, { buttons: 1, target }));

    // Assert
    expect(onInteractionEnd).toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });

  test('does not fire interaction start - not targeted', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const svDiv = getByTitle('Saturation and Value');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(document, createEvent.pointerDown(document, { buttons: 1, target }));
    fireEvent(svDiv, createEvent.pointerUp(svDiv, { buttons: 1, target }));

    // Assert
    expect(onInteractionStart).not.toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });

  test('color updates when setting hue - pointerdown', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(hueDiv, createEvent.pointerDown(hueDiv, { buttons: 1, target }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#ff0000');
    (window as any).PointerEvent = undefined;
  });

  test('color updates when setting hue - pointermove', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(hueDiv, createEvent.pointerDown(hueDiv, { buttons: 1, target }));
    fireEvent(hueDiv, createEvent.pointerMove(hueDiv, { buttons: 1, target }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
    (window as any).PointerEvent = undefined;
  });

  test('does not update color when interaction was not started - hue pointermove', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');

    // Act
    fireEvent(hueDiv, createEvent.pointerMove(hueDiv, { buttons: 1 }));

    // Assert
    expect(onChange).not.toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });

  test('color updates when setting saturation/value - pointerdown', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };


    // Act
    fireEvent(svDiv, createEvent.pointerDown(svDiv, { buttons: 1, target }));

    // Assert
    expect(onChange).toHaveBeenCalledWith('#000000');
    (window as any).PointerEvent = undefined;
  });

  test('color updates when setting saturation/value - pointermove', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');
    const target = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
    };

    // Act
    fireEvent(svDiv, createEvent.pointerDown(svDiv, { buttons: 1, target }));
    fireEvent(svDiv, createEvent.pointerMove(svDiv, { buttons: 1, target }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
    (window as any).PointerEvent = undefined;
  });

  test('does not update color when interaction was not started - saturation/value pointermove', () => {
    // Arrange
    window.PointerEvent = MockPointerEvent;
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.pointerMove(svDiv, { buttons: 1 }));

    // Assert
    expect(onChange).not.toHaveBeenCalled();
    (window as any).PointerEvent = undefined;
  });
});

describe('ReactColorPicker - Mouse Events', () => {
  test('fires interaction start - hue mousedown', () => {
    // Arrange
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const hueDiv = getByTitle('Hue');

    // Act
    fireEvent(hueDiv, createEvent.mouseDown(hueDiv, { buttons: 1 }));

    // Assert
    expect(onInteractionStart).toHaveBeenCalled();
  });

  test('fires interaction start - saturation/value mousedown', () => {
    // Arrange
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.mouseDown(svDiv, { buttons: 1 }));

    // Assert
    expect(onInteractionStart).toHaveBeenCalled();
  });

  test('does not fire interaction start - not targeted', () => {
    // Arrange
    const onInteractionStart = jest.fn();
    render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);

    // Act
    fireEvent(document, createEvent.mouseDown(document, { buttons: 1 }));

    // Assert
    expect(onInteractionStart).not.toHaveBeenCalled();
  });

  test('fires interaction end - mouseup', () => {
    // Arrange
    const onInteractionEnd = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionEnd={onInteractionEnd} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.mouseDown(svDiv, { buttons: 1 }));
    fireEvent(svDiv, createEvent.mouseUp(svDiv, { buttons: 1 }));

    // Assert
    expect(onInteractionEnd).toHaveBeenCalled();
  });

  test('does not fire interaction start - not targeted', () => {
    // Arrange
    const onInteractionStart = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onInteractionStart={onInteractionStart} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(document, createEvent.mouseDown(document, { buttons: 1 }));
    fireEvent(svDiv, createEvent.mouseUp(svDiv, { buttons: 1 }));

    // Assert
    expect(onInteractionStart).not.toHaveBeenCalled();
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
    fireEvent(hueDiv, createEvent.mouseDown(hueDiv, { buttons: 1 }));
    fireEvent(hueDiv, createEvent.mouseMove(hueDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('does not update color when interaction was not started - hue mousemove', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const hueDiv = getByTitle('Hue');

    // Act
    fireEvent(hueDiv, createEvent.mouseMove(hueDiv, { buttons: 1 }));

    // Assert
    expect(onChange).not.toHaveBeenCalled();
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
    fireEvent(svDiv, createEvent.mouseDown(svDiv, { buttons: 1 }));
    fireEvent(svDiv, createEvent.mouseMove(svDiv, { buttons: 1 }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test('does not update color when interaction was not started - saturation/value mousemove', () => {
    // Arrange
    const onChange = jest.fn();
    const { getByTitle } = render(<ReactColorPicker color="#00ff00" onChange={onChange} />);
    const svDiv = getByTitle('Saturation and Value');

    // Act
    fireEvent(svDiv, createEvent.mouseMove(svDiv, { buttons: 1 }));

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('ReactColorPicker - Hex Input', () => {
  const originalHex = '#ff0000';
  const updatedHex = '#00ff00';

  test('color updates when the property changes', () => {
    // Arrange
    const { getByLabelText, rerender } = render(<ReactColorPicker color={originalHex} />);

    // Act
    rerender(<ReactColorPicker color={updatedHex}/>);

    // Assert
    const hexInput = getByLabelText('Hex:') as HTMLInputElement;
    expect(hexInput.value).toEqual(updatedHex);
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
    const hexInput = getByLabelText('Hex:') as HTMLInputElement;

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
    const hexInput = getByLabelText('Hex:') as HTMLInputElement;

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
    const hexInput = getByLabelText('Hex:') as HTMLInputElement;

    // Act
    fireEvent.keyDown(hexInput, { key: 'A' });

    // Assert
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(hexInput.value).toEqual(originalHex);
  });
});

describe('ReactColorPicker - Properties', () => {
  test('null color is sanitized', () => {
    // Arrange
    // Act
    const { getByLabelText } = render(<ReactColorPicker color={null} />);
    const hexInput = getByLabelText('Hex:') as HTMLInputElement;

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
    const containerElement = container.firstChild! as HTMLDivElement;
    expect(containerElement.classList.contains(testClassName)).toBe(true);
  });
});
