import config from '../../config.json';
import Card from './card';
import Category from './category';
import LoginData from './loginData';
import UserData from './userData';
import MainData from './mainData';

/** Запрашивает данные у нашего API.
 *
 * @param {string} link должен начинаться со слэша `/`.
 * @param {string} method по умолчанию GET.
 * @param {object} body если не нужен, передаём `null`*.
 * @param {string} token если не нужен, передаём `null`*.
 * @param {boolean} requireJSON нужно ли выдавать JSON,
 * @param {boolean} isMultiForm multiform или JSON лежит в body?
 * если нет, придёт сам объект Response
 *
 * \* - или что-то другое, что вернёт `false` при проверке.
 */
export default function request(
  link = '/',
  method = 'GET',
  body = null,
  token = '',
  requireJSON = true,
  isMultiForm = false,
) {
  method = method.toUpperCase();
  const param = { method };
  if (body) param.body = JSON.stringify(body);
  param.headers = {
    'Content-Type': isMultiForm ? '*/*' : 'application/json; charset=UTF-8',
  }; // потому что "multipart/form-data" мытарил душу как мог
  if (token) {
    param.headers.Authorization = `Bearer ${token}`;
  }
  return fetch(config.apiURL + link, param)
    .then(data =>
      data.ok
        ? requireJSON
          ? data.json()
          : data
        : { error: data.status, errorText: data.statusText },
    )
    .then(data => setDataType(data, link));
}

/**
 * @param {object} obj
 * @param {string} link
 * @returns
 */
function setDataType(obj, link) {
  if (link === '/auth/login') return new LoginData(obj);
  if (link.includes('/user')) return new UserData(obj);
  if (link.includes('/call?page=')) return new MainData(obj);
  if (link.includes('/favourite'))
    return new Category({
      name: 'favourite',
      cardList: Object.values(obj)[0],
    });
  if (link.includes('/own'))
    return new Category({
      name: 'own',
      cardList: Object.values(obj)[0],
    });
  if (link.includes('/specific')) {
    const catName = link.slice(link.indexOf('/specific') + '/specific'.length + 1);
    return new Category({
      name: catName,
      cardList: obj,
    });
  }
  if (link.includes('/find'))
    return new Category({
      name: 'searchResults',
      search: decodeURIComponent(link.slice(link.indexOf('=') + 1)),
      cardList: obj,
    });
  return obj;
}
