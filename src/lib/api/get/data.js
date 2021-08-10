import request from '../request';
import Data from '../data';

export async function data(link = '/', token = '') {
  return new Data(await request(link, 'GET', null, token));
}
