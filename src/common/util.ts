/**
 * Saturation / Value of a color
 * @property {number} saturation The saturation of a color
 * @property {number} value The value of a color
 */
export type SaturationValue = {
  saturation: number,
  value: number
}

/**
 * Position on a page
 * @property {number} left The left position on the page
 * @property {number} top The top position on the page
 */
export type PagePosition = {
  left: number,
  top: number
}

/**
 * Gets the page relative top/left position of an element
 * @param {HTMLElement} element The DOM element to get the page position of
 * @returns {PagePosition} The position on the page
 */
export function getPagePosition(element: HTMLElement): PagePosition {
  let left = element.offsetLeft;
  let top = element.offsetTop;

  let currentElement: HTMLElement = element;
  while (currentElement.offsetParent) {
    currentElement = currentElement.offsetParent as HTMLElement;

    left += currentElement.offsetLeft;
    top += currentElement.offsetTop;
  }

  return {
    left,
    top,
  };
}

/**
 * Sanitize and combine classNames to a single string
 * @param  {string[]} classNames The classNames to combine
 * @returns {string} The combined class names
 */
export function getCombinedClassNames(...classNames: (string|null|boolean|object)[]): string {
  // Filter any null values
  const filteredClassnames = classNames.filter((className) => (
    typeof className === 'string' && className
  ));

  return (filteredClassnames.join(' '));
}


/**
 * Get the hue value from a given position on the hue slider
 * @param {number} x The x coordinate on the hue slider
 * @param {number} width The width of the hue slider
 * @returns {number} The hue based on the x position
 */
export function getHueFromPosition(x: number, width: number): number {
  if (!width) {
    return 0;
  }

  const percentage = x / width;
  const hue = Math.max(Math.min(percentage, 1), 0) * 360;

  return hue;
}

/**
 * Get the saturation and value from a given position on the SV slider
 * @param {number} x The x coordinate on the SV selector
 * @param {number} y The y coordinate on the SV selector
 * @param {number} width The width of the SV selector
 * @param {number} height The height of the SV selector
 * @returns {SaturationValue} The saturation and value based on the position
 */
export function getSaturationValueFromPosition(x: number, y: number, width: number, height: number): SaturationValue {
  const percentageX = (!width) ? 0 : x / width;
  const percentageY = (!height) ? 0 : 1 - (y / height);

  const saturation = Math.max(Math.min(percentageX, 1), 0);
  const value = Math.max(Math.min(percentageY, 1), 0);

  return {
    saturation,
    value,
  };
}
