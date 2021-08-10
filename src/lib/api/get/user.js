import UserData from '../data';
import data from './data';

/**
 *
 * @param {string} token
 * @returns
 */
export default async function user(token) {
  return await new UserData(data('/user', token));
}
