import store from '../lib/store';

const menuBtnRef = document.querySelector('[data-menu-button]');
const mobileMenuRef = document.querySelector('[data-menu]');
const mobileBtnClose = document.querySelector('[data-menu-close]');
const mobileFilterBtn = document.querySelector('[data-mobile-filter-btn]');
const tabletFilter = document.querySelector('[data-tab-filter]');
const tabletFilterBtn = document.querySelector('[data-tab-filter-btn]');
const clearBtnsRef = document.querySelectorAll('.js-clear');
const headerInputRefs = document.querySelectorAll('.js-input-search');
const searchWrapperMob = document.querySelector('#search-wrapper-mob');

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

document.querySelector('.js-show-input').addEventListener('click', e => {
  searchWrapperMob.classList.add('is-search');
});

const searchBtnRefs = document.querySelectorAll('.js-search');
// searchBtnRefs[0].addEventListener('click', () => {
//   let search = headerInputRefs[0].value;
//   if (search && search.length) {
//     store.setQuery({ search });
//     headerInputRefs.forEach(ref => (ref.value = ''));
//     searchWrapperMob.classList.remove('is-search');
//   } else {
//     store.setQuery(null);
//   }
// });

searchBtnRefs[1].addEventListener('click', () => {
  let search = headerInputRefs[1].value;
  if (search && search.length) {
    debugger;
    store.setQuery({ search });
    headerInputRefs.forEach(ref => (ref.value = ''));
    searchWrapperMob.classList.remove('is-search');
  } else {
    store.setQuery({ search: '' });
    //store.setQuery(null);
  }
});

searchBtnRefs.forEach(ref => {
  ref.addEventListener('click', searchInput);
});

// const headerInputSearch = document.querySelector('.js-input-search-mob');
// const inputSearchBtnMob = document.querySelector('.js-inputbtn-mob');

// function searchInput() {
//   let search = headerInputRef.value;
//   if (search && search.length) {
//     store.setQuery({ search });
//     headerInputRef.value = '';
//     headerInputSearch.value = '';
//     saerchWrapperMob.classList.remove('is-search');
//   } else {
//     store.setQuery(null);
//   }
// }

// inputSearchBtnMob.addEventListener('click', searchInput);
// searchBtnRef.addEventListener('click', searchInput);
