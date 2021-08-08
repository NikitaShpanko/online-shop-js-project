const allCategorys = document.querySelector('body');

allCategorys.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    if (buttonClick.nodeName !== 'BUTTON') return false;

    if (buttonClick.classList.contains('icon-heart-white')) {

        buttonClick.classList.toggle('isFavorites');    
    }
  });