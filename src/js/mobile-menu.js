  
(() => {
  const menuBtnRef = document.querySelector("[data-menu-button]");
  const mobileMenuRef = document.querySelector("[data-menu]");
  const mobileBtnClose = document.querySelector("[data-menu-close]");
  const tabletFilter = document.querySelector("[data-filter]");
  const tabletFilterBtn = document.querySelector("[data-filter-btn]");

  menuBtnRef.addEventListener("click", () => {
    mobileMenuRef.classList.toggle("is-open");
  });

  mobileBtnClose.addEventListener("click", () => {
    mobileMenuRef.classList.toggle("is-open");
  });

  tabletFilterBtn.addEventListener("click", () => {
    tabletFilter.classList.toggle("is-open");
  });

})();