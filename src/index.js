import './sass/main.scss';
import './js/cardButton';

import adsTpl from './templates/advertising-card.hbs';
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

  const adSettings = new RenderSettings({
    acceptLink: isRootLink,
    linkTransform: '/call/ads',
    dataTransform: data => data.slice(0, config.adCount),
    template: adsTpl,
  });

  const defaultSettings = new RenderSettings({
    acceptLink: isRootLink,
    linkTransform: '/call?page=1',
    dataTransform: allCatsTransform,
    template: categoriesTpl,
    replaceDOM: (el, tpl) => {
      RenderSettings.appendDOM(el, tpl);
    },
    errorReplaceDOM: (el, tpl) => {
      RenderSettings.errorAppendDOM(el, tpl);
    },
  });

  const categorySettings = new RenderSettings({
    acceptLink: link => link?.includes('category') && !link.includes('sales'),
    linkTransform: link => '/call/specific' + link.slice('/category'.length),
    dataTransform: singleCatTransform,
    template: categoriesTpl,
    changeLink: true,
  });

  const salesSettings = new RenderSettings({
    acceptLink: link => link?.includes('sales'),
    linkTransform: '/call?page=1',
    dataTransform: data => allCatsTransform({ sales: data.sales }),
    template: categoriesTpl,
    changeLink: true,
  });

  const mainRender = new Render(
    document.querySelector('main'),
    adSettings,
    defaultSettings,
    categorySettings,
    salesSettings,
  );
  mainRender.render();
  document.querySelector('body').addEventListener('click', e => {
    if (!e.target.closest('a')) return;
    const href = e.target.getAttribute('href');
    if (href[0] !== '/') return; //если вдруг где внешняя ссылка затешется
    e.preventDefault();
    mainRender.render(href);
  });
  window.addEventListener('popstate', () => mainRender.render());

  function isRootLink(link) {
    return link === '/' || link === '/index.html';
  }

  function allCatsTransform(data) {
    return Object.entries(data).map(([name, data]) => ({
      link: `/category/${name}`,
      name: rusCategoryNames[name],
      card: cardTpl(data),
      changeLink: true,
    }));
  }

  /** @param {Render} renderObj */
  function singleCatTransform(data, renderObj) {
    return [
      { name: rusCategoryNames[renderObj.link.slice('/category'.length + 1)], card: cardTpl(data) },
    ];
  }
});
