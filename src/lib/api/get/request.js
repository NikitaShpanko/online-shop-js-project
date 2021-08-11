import { request as commonRequest } from '../../api';
/**
 *
 * @param {string} link
 * @param {string} token
 * @returns {object}
 */
export default async function request(link = '/', token = '') {
  return await commonRequest(link, 'GET', null, token);
}
