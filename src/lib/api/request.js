import config from '../../config.json';

/** Запрашивает данные у нашего API.
 *
 * @param {string} link должен начинаться со слэша `/`.
 * @param {string} method по умолчанию GET.
 * @param {object} body игнорируется методами GET и HEAD.
 */
export default function request(link = '/', method = 'GET', body = {}, token = '') {
  method = method.toUpperCase();
  const param = { method };
  if (method !== 'GET' && method !== 'HEAD' && method !== 'DELETE') {
    param.body = JSON.stringify(body);
    param.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
    if (token) {
      param.headers.Authorization = `Bearer ${token}`;
    }
  }
  return fetch(config.apiURL + link, param).then(data =>
    data.ok ? data.json() : { error: data.status, errorText: data.statusText },
  );
}