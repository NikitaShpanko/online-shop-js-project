import config from '../../config.json';

/** Запрашивает данные у нашего API.
 *
 * @param {string} link должен начинаться со слэша `/`.
 * @param {string} method по умолчанию GET.
 * @param {object} body если не нужен, передаём `null`*.
 * @param {string} token если не нужен, передаём `null`*.
 * @param {boolean} requireJSON нужно ли выдавать JSON, если
 * нет, придёт простая строка `"Success!"`
 *
 * \* - или что-то другое, что вернёт `false` при проверке.
 */
export default function request(
  link = '/',
  method = 'GET',
  body = null,
  token = '',
  requireJSON = true,
) {
  method = method.toUpperCase();
  const param = { method };
  if (body) param.body = JSON.stringify(body);
  param.headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  };
  if (token) {
    param.headers.Authorization = `Bearer ${token}`;
  }
  return fetch(config.apiURL + link, param).then(data =>
    data.ok
      ? requireJSON
        ? data.json()
        : 'Success!'
      : { error: data.status, errorText: data.statusText },
  );
}
