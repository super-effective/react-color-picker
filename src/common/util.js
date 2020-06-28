/**
 * @typedef {Object} Event
 * @property {Object} target The target element of the event
 */

/**
 * @typedef {Object} Element
 * @property {number} offsetLeft The left offset of the element
 * @property {number} offsetTop The top offset of the element
 * @property {Element} offsetParent The parent element the offset is relative to
 * @property {Element} parentElement The parent element
 */


/**
 * Check's if a referenced element is the target or parent of the target of an event
 * @param {Event} target The interaction event
 * @param {Object} ref A ref from a react useRef hook (object with a .current property)
 */
export function isRefTargeted(evt, ref) {
  // Missing ref or event/target
  if (!ref || !ref.current || !evt || !evt.target) {
    return false;
  }

  let currentTarget = evt.target;
  do {
    if (currentTarget === ref.current) {
      return true;
    }
    currentTarget = currentTarget.parentElement;
  } while (currentTarget);

  return false;
}

/**
 * Gets the page relative top/left position of an element
 * @param {Element} element The DOM element to get the page position of
 */
export function getPagePosition(element) {
  let left = element.offsetLeft;
  let top = element.offsetTop;

  let currentElement = element;
  while (currentElement.offsetParent) {
    currentElement = currentElement.offsetParent;

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
 * @param  {...string} classNames The classNames to combine
 */
export function getCombinedClassNames(...classNames) {
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
 */
export function getHueFromPosition(x, width) {
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
 */
export function getSaturationValueFromPosition(x, y, width, height) {
  const percentageX = (!width) ? 0 : x / width;
  const percentageY = (!height) ? 0 : 1 - (y / height);

  const saturation = Math.max(Math.min(percentageX, 1), 0);
  const value = Math.max(Math.min(percentageY, 1), 0);

  return {
    saturation,
    value,
  };
}
