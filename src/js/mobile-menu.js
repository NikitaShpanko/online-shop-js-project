  import store from '../lib/store';

  const menuBtnRef = document.querySelector("[data-menu-button]");
  const mobileMenuRef = document.querySelector("[data-menu]");
  const mobileBtnClose = document.querySelector("[data-menu-close]");
  const mobileFilterBtn = document.querySelector("[data-mobile-filter-btn]");
  const tabletFilter = document.querySelector("[data-tab-filter]");
  const tabletFilterBtn = document.querySelector("[data-tab-filter-btn]");
  const clearBtnsRef = document.querySelectorAll(".js-clear");
  const headerInputRef = document.querySelector(".js-input-search");
  

  menuBtnRef.addEventListener("click", () => {
    mobileMenuRef.classList.toggle("is-open");
  });

  mobileBtnClose.addEventListener("click", () => {
    mobileMenuRef.classList.toggle("is-open");
  });

  mobileFilterBtn.addEventListener("click", () => {
    document.querySelector("[data-mobile-filter]")
      .classList.toggle("is-open-filter");
  });

  tabletFilterBtn.addEventListener("click", () => {
    tabletFilter.classList.toggle("is-open-filter");
  });

  document.addEventListener('click', (e) =>{
    if (e.target.closest(".is-open-filter") === null 
      && !(e.target.closest('.header__filter-buttons'))) {
      tabletFilter.classList.remove("is-open-filter");
    }
  });

  clearBtnsRef[0].addEventListener("click", () => {
     document.querySelectorAll('.header__filter-item').forEach(ref => {
      ref.classList.remove('is-orange')
    })
    store.setQuery(null);
   
  });

  clearBtnsRef[1].addEventListener("click", () => {
    document.querySelectorAll('.header__filter-item').forEach(ref => {
      ref.classList.remove('is-orange')
      console.log(document.querySelectorAll('.header__filter-item'))
    })
    store.setQuery(null);
  });

  headerInputRef.addEventListener('input', e => {
   const search = e.currentTarget.value;
      if (search && search.length) {
        store.setQuery({ search })
      } else {
        store.setQuery(null)
      }
  });





