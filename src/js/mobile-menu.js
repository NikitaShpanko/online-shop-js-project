  
  const menuBtnRef = document.querySelector("[data-menu-button]");
  const mobileMenuRef = document.querySelector("[data-menu]");
  const mobileBtnClose = document.querySelector("[data-menu-close]");
  const mobileFilterBtn = document.querySelector("[data-mobile-filter-btn]");
  const tabletFilter = document.querySelector("[data-tab-filter]");
  const tabletFilterBtn = document.querySelector("[data-tab-filter-btn]");

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

  
