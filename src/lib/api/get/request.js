import request from '../request';
/**
 *
 * @param {string} link
 * @param {string} token
 * @returns {object}
 */
export default async function data(link = '/', token = '') {
  return await request(link, 'GET', null, token);
}
