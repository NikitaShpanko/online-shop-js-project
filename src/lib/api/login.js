import request from './request';
import LoginData from './loginData';

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {LoginData}
 */
export default async function login(email, password) {
  return new LoginData(await request('/auth/login', 'POST', { email, password }, null));
}
