import UserData from '../userData';
import request from './request';

/**
 *
 * @param {string} token
 * @returns {UserData}
 */
export default async function user(token) {
  return new UserData(await request('/user', token));
}
