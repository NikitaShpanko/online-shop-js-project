import toCamelCase from '../toCamelCase';
import request from '../request';

export default async function categoryNames() {
  const names = await request('/call/categories');
  const rusNames = await request('/call/russian-categories');
  const catObj = {};
  names.forEach((name, i) => {
    catObj[toCamelCase(name)] = rusNames[i];
  });
  return catObj;
}
