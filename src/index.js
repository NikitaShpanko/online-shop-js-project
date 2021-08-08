import './sass/main.scss';

import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import config from './config.json';

import * as API from './lib/api';
import Render from './lib/render';
import RenderSettings from './lib/renderSettings';
import './js/auth-form';
import './js/mobile-menu';
import categoryNames from './js/categoryNames';

RenderSettings.errorTemplate = errorTpl;

categoryNames().then(rusCategoryNames => {
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  console.log(rusCategoryNames);

  const defaultSettings = new RenderSettings({
    acceptLink: link => link === '/' || link === '/index.html',
    linkTransform: '/call?page=1',
    dataTransform: allCatsTransform,
    template: categoriesTpl,
  });

  const categorySettings = new RenderSettings({
    acceptLink: link => link.includes('category'),
    linkTransform: link => '/call/specific' + link.slice('/category'.length),
    dataTransform: singleCatTransform,
    template: categoriesTpl,
    changeLink: true,
  });

  const mainRender = new Render(document.querySelector('main'), defaultSettings, categorySettings);
  mainRender.render();

  function allCatsTransform(data) {
    return Object.entries(data).map(([name, data]) => ({
      name: rusCategoryNames[name],
      card: cardTpl(data),
    }));
  }

  function singleCatTransform(data, link) {
    return [{ name: rusCategoryNames[link.slice('/category'.length + 1)], card: cardTpl(data) }];
  }
});
