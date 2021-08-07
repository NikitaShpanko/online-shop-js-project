import './sass/main.scss';

import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import Render from './js/render';

Render.errorTemplate = errorTpl;

// Это просто тест:
const mainRender = new Render(document.querySelector('main'));
mainRender.dataTransform = data => Object.values(data)[0];
mainRender.template = cardTpl;
mainRender.changeLink = true;
mainRender.changeLinkOnRoot = true;
mainRender.render();

// (async () => {
//   await mainRender.render();
//   await mainRender.append('/call?page=2');
//   await mainRender.append('/call?page=3');
//   await mainRender.append('/call?page=4');
// })();
