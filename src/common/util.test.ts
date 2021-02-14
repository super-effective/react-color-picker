import {
  getPagePosition,
  getCombinedClassNames,
  getHueFromPosition,
  getSaturationValueFromPosition,
} from './util';


const parentElement = {
  offsetLeft: 1,
  offsetTop: 1,
  offsetParent: null,
  parentElement: null,
} as HTMLElement;

const firstChildElement = {
  offsetLeft: 3,
  offsetTop: 3,
  offsetParent: parentElement as Element,
  parentElement,
} as HTMLElement;

const secondChildElement = {
  offsetLeft: 5,
  offsetTop: 5,
  offsetParent: firstChildElement as Element,
  parentElement: firstChildElement as Element,
} as HTMLElement;


/**
 * getPagePosition
 */
describe('getPagePosition', () => {
  test('getPagePosition', () => {
    // Arrange
    // Act
    const pagePosition = getPagePosition(secondChildElement);

    // Assert
    expect(pagePosition).toStrictEqual({
      left: 9,
      top: 9,
    });
  });

  test('getPagePosition - no parent', () => {
    // Arrange
    // Act
    const pagePosition = getPagePosition(parentElement);

    // Assert
    expect(pagePosition).toStrictEqual({
      left: 1,
      top: 1,
    });
  });
});


/**
 * getCombinedClassNames
 */
describe('getCombinedClassNames', () => {
  test('getCombinedClassNames', () => {
    // Arrange
    // Act
    const combinedClassNames = getCombinedClassNames('test', 'abc');

    // Assert
    expect(combinedClassNames).toEqual('test abc');
  });

  test('getCombinedClassNames - null value', () => {
    // Arrange
    // Act
    const combinedClassNames = getCombinedClassNames('test', null, 'abc');

    // Assert
    expect(combinedClassNames).toEqual('test abc');
  });

  test('getCombinedClassNames - bool value', () => {
    // Arrange
    // Act
    const combinedClassNames = getCombinedClassNames('test', false, 'abc');

    // Assert
    expect(combinedClassNames).toEqual('test abc');
  });

  test('getCombinedClassNames - object value', () => {
    // Arrange
    // Act
    const combinedClassNames = getCombinedClassNames('test', {}, 'abc');

    // Assert
    expect(combinedClassNames).toEqual('test abc');
  });
});


/**
 * getHueFromPosition
 */
describe('getHueFromPosition', () => {
  test('getHueFromPosition', () => {
    // Arrange
    const sliderWidth = 100;
    const x = 50;

    // Act
    const hue = getHueFromPosition(x, sliderWidth);

    // Assert
    expect(hue).toEqual(180);
  });

  test('getHueFromPosition - < 1', () => {
    // Arrange
    const sliderWidth = 100;
    const x = -5;

    // Act
    const hue = getHueFromPosition(x, sliderWidth);

    // Assert
    expect(hue).toEqual(0);
  });

  test('getHueFromPosition - > 100', () => {
    // Arrange
    const sliderWidth = 100;
    const x = 105;

    // Act
    const hue = getHueFromPosition(x, sliderWidth);

    // Assert
    expect(hue).toEqual(360);
  });
});

/**
 * getSaturationValueFromPosition
 */
describe('getSaturationValueFromPosition', () => {
  test('getSaturationValueFromPosition', () => {
    // Arrange
    const selectorWidth = 100;
    const selectorHeight = 100;
    const x = 50;
    const y = 50;

    // Act
    const saturationValueFromPosition = getSaturationValueFromPosition(
      x,
      y,
      selectorWidth,
      selectorHeight,
    );

    // Assert
    expect(saturationValueFromPosition).toStrictEqual({
      saturation: 0.5,
      value: 0.5,
    });
  });

  test('getSaturationValueFromPosition - < 1', () => {
    // Arrange
    const selectorWidth = 100;
    const selectorHeight = 100;
    const x = -1;
    const y = -1;

    // Act
    const saturationValueFromPosition = getSaturationValueFromPosition(
      x,
      y,
      selectorWidth,
      selectorHeight,
    );

    // Assert
    expect(saturationValueFromPosition).toStrictEqual({
      saturation: 0,
      value: 1, // Value Y scale is inverted
    });
  });

  test('getSaturationValueFromPosition - > 100', () => {
    // Arrange
    const selectorWidth = 100;
    const selectorHeight = 100;
    const x = 105;
    const y = 105;

    // Act
    const saturationValueFromPosition = getSaturationValueFromPosition(
      x,
      y,
      selectorWidth,
      selectorHeight,
    );

    // Assert
    expect(saturationValueFromPosition).toStrictEqual({
      saturation: 1,
      value: 0, // Value Y scale is inverted
    });
  });
});
