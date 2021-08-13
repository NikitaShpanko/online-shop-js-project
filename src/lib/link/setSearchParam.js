import parse from './parse';

/**
 *
 * @param {string} link
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
export default function setSearchParam(link, name, value) {
  return `${link}${link.includes('?') ? '&' : '?'}${name}=${encodeURIComponent(value)}`;
}
