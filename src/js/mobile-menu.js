import store from '../lib/store';

export default function () {
  const menuBtnRef = document.querySelector('[data-menu-button]');
  const mobileMenuRef = document.querySelector('[data-menu]');
  const mobileBtnClose = document.querySelector('[data-menu-close]');
  const mobileFilterBtn = document.querySelector('[data-mobile-filter-btn]');
  const tabletFilter = document.querySelector('[data-tab-filter]');
  const tabletFilterBtn = document.querySelector('[data-tab-filter-btn]');
  const clearBtnsRef = document.querySelectorAll('.js-clear');
  const headerInputRef = document.querySelector('.js-input-search');

  menuBtnRef.addEventListener('click', () => {
    mobileMenuRef.classList.toggle('is-open');
  });

  mobileBtnClose.addEventListener('click', () => {
    mobileMenuRef.classList.toggle('is-open');
  });

  mobileFilterBtn.addEventListener('click', () => {
    document.querySelector('[data-mobile-filter]').classList.toggle('is-open-filter');
  });

  tabletFilterBtn.addEventListener('click', () => {
    tabletFilter.classList.toggle('is-open-filter');
  });

  document.addEventListener('click', e => {
    if (
      e.target.closest('.is-open-filter') === null &&
      !e.target.closest('.header__filter-buttons')
    ) {
      tabletFilter.classList.remove('is-open-filter');
    }
  });

  clearBtnsRef[0].addEventListener('click', () => {
    document.querySelectorAll('.header__filter-item').forEach(ref => {
      ref.classList.remove('is-orange');
    });
    store.setQuery(null);
  });

  clearBtnsRef[1].addEventListener('click', () => {
    document.querySelectorAll('.header__filter-item').forEach(ref => {
      ref.classList.remove('is-orange');
    });
    store.setQuery(null);
  });

  const searchBtnRef = document.querySelector('.js-search');

  searchBtnRef.addEventListener('click', () => {
    let search = headerInputRef.value;
    if (search && search.length) {
      store.setQuery({ search });
      headerInputRef.value = '';
    } else {
      store.setQuery(null);
    }
  });
}
