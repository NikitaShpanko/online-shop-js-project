import * as API from '../lib/api';
import RenderSettings from '../lib/renderSettings';

/* Когда будет готов шаблон для категорий в хэдере,
 * его нужно импортировать в этот модуль, а затем
 * можно будет раскомментировать этот код и закомментировать
 * нынешний export default.
 */
// import headerTpl from '{{шаблон для категорий в хэдере}}'
//
// const headerSettings = new RenderSettings({
//     acceptLink: true,
//     request: requestCategories,
//     dataTransform: obj => Object.entries(obj).map(([name, rusName]) => ({ name, rusName })),
//     template: headerTpl
//   });
//
// export default async () => {
//   const headerRender = new Render('{{селектор, в который нужно поместить шаблон}}', headerSettings);
//   await headerRender.render();
// return headerRender.data;
//}

export default async () => {
  return await requestCategories();
};

async function requestCategories() {
  const names = await API.request('/call/categories');
  const rusNames = await API.request('/call/russian-categories');
  const catObj = {};
  names.forEach((name, i) => {
    catObj[toCamelCase(name)] = rusNames[i];
  });
  return catObj;
}

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
