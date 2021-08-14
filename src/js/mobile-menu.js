import store from '../lib/store';

const tabletFilter = document.querySelector('[data-tab-filter]');
const tabletFilterBtn = document.querySelector('[data-tab-filter-btn]');
const clearBtnsRef = document.querySelectorAll('.js-clear');
const headerInputRefs = document.querySelectorAll('.js-input-search');
const searchWrapperMob = document.querySelector('#search-wrapper-mob');
const searchFormRefs = document.querySelectorAll('.js-form');

document.querySelector('[data-menu-button]').addEventListener('click', openMenu);
document.querySelector('[data-menu-close]').addEventListener('click', openMenu);
function openMenu() {
  document.querySelector('[data-menu]').classList.toggle('is-open');
}

document.querySelector('[data-mobile-filter-btn]').addEventListener('click', () => {
  document.querySelector('[data-mobile-filter]').classList.toggle('is-open-filter');
});

tabletFilterBtn.addEventListener('click', () => {
  tabletFilter.classList.toggle('is-open-filter');
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

document.addEventListener('click', e => {
  if (
    e.target.closest('.is-open-filter') === null &&
    !e.target.closest('.header__filter-buttons') &&
    !e.target.closest('.js-burger-wrapper') &&
    !e.target.closest('.js-input-search')
  ) {
    tabletFilter.classList.remove('is-open-filter');
    searchWrapperMob.classList.remove('is-search');
  }
});

document.querySelector('.js-show-input').addEventListener('click', () => {
  searchWrapperMob.classList.add('is-search');
});

function searchInput(headerInputRef) {
  let search = headerInputRef.value;
  if (search && search.length) {
    store.setQuery({ search });
    headerInputRefs.forEach(ref => (ref.value = ''));
    searchWrapperMob.classList.remove('is-search');
  } else {
    store.setQuery(null);
  }
}

const searchBtnRefs = document.querySelectorAll('.js-search');
searchBtnRefs.forEach((ref, index) => {
  ref.addEventListener('click', () => searchInput(headerInputRefs[index]));
});

searchFormRefs.forEach((ref, index) => {
  ref.addEventListener('submit', e => {
    e.preventDefault();
    searchInput(headerInputRefs[index]);
  });
});
