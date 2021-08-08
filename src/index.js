import './sass/main.scss';
import './js/mobile-menu';

import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import Render from './lib/render';

Render.errorTemplate = errorTpl;

// Это просто тест:
const mainRender = new Render(document.querySelector('main'));
mainRender.linkTransform = link => (link.slice(0, link.length - 1) === '/call?page=' ? link : '');
mainRender.dataTransform = data =>
  Object.entries(data).map(([name, data]) => ({
    name,
    card: cardTpl(data),
  }));
mainRender.template = categoriesTpl;
// data => categoriesTpl(data);
mainRender.changeLink = true;
mainRender.changeLinkOnRoot = true;
mainRender.render().then(() => console.log(mainRender.data));

// (async () => {
//   await mainRender.render('/call?page=1');
//   await mainRender.append('/call?page=2');
//   await mainRender.append('/call?page=3');
//   console.log(Object.entries(mainRender.data));
// })();
