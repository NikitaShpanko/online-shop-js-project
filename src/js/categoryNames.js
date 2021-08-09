import * as API from '../lib/api';

export default async () => {
  const names = await API.request('/call/categories');
  const rusNames = await API.request('/call/russian-categories');
  const catObj = {};
  names.forEach((name, i) => {
    catObj[toCamelCase(name)] = rusNames[i];
  });
  return catObj;
};

function toCamelCase(str) {
  let newStr = '';
  let isUp = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == ' ') {
      isUp = true;
    } else {
      newStr += isUp ? str[i].toUpperCase() : str[i];
      isUp = false;
    }
  }
  return newStr;
}
