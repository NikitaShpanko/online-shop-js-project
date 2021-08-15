import config from '../../config.json';

/**
 * @typedef linkData
 * @property {string[]} pathList
 * @property {object} search
 * @property {string} hash
 * @property {string} shortLink
 */
/**
 * @param {string} link
 * @returns {linkData}
 */
export default function parse(link, lowerCase = false) {
  const hashIndex = link.indexOf('#');
  let hash = '';
  if (hashIndex > -1) {
    hash = link.slice(hashIndex + 1);
    link = link.slice(0, hashIndex);
  }

  let pathname;
  if (link[0] === '/') {
    const paramIndex = link.indexOf('?');
    if (paramIndex > -1) pathname = link.slice(0, paramIndex);
    else pathname = link;
  } else {
    const url = new URL(link);
    pathname = url.pathname;
    const projNameIndex = pathname.indexOf(config.projectName);
    if (projNameIndex > -1) {
      const projNameLength = config.projectName.length;
      pathname = pathname.slice(projNameIndex + projNameLength);
    }
  }

  if (lowerCase) pathname = pathname.toLowerCase();

  const linkData = {};
  linkData.pathList = pathname.slice(1).split('/');
  linkData.search = {};
  linkData.hash = hash;

  let hasParams = false;
  const paramIndex = link.indexOf('?');
  if (paramIndex > -1) {
    const usp = new URLSearchParams(
      link.slice(paramIndex),
      //link.slice(paramIndex, hashIndex > paramIndex ? hashIndex : Infinity),
    );
    config.searchParams.forEach(configParam => {
      const values = usp.getAll(configParam);
      switch (values.length) {
        case 0:
          return;
        case 1:
          linkData.search[configParam] = values[0];
          break;
        default:
          linkData.search[configParam] = values;
      }
      hasParams = true;
    });
    if (hasParams) linkData.shortLink = `${pathname}?${usp.toString()}`;
  }
  if (!hasParams) linkData.shortLink = pathname;

  // linkData.hash = hashIndex > -1 ? link.slice(hashIndex + 1) : '';

  return linkData;
}
