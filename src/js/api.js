import config from '../config.json';

/** Converts endpoint string and data object to a
 * complete URL, ready to be passed to our API.
 *
 * `link` must start with a slash `/`.
 */
function apiLink(link = '/', data = {}) {
  const url = new URL(link, config.apiURL);
  Object.entries(data).forEach(([key, value]) => url.searchParams.append(key, value));
  return url.toString();
}

/** Request data from our dear API.
 *
 * `link` must start with a slash `/`.
 */
export function request(link = '/', data = {}) {
  return fetch(apiLink(link, data)).then(data => data.json());
}
