const allCategorys = document.querySelector('body');

allCategorys.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    const heartIcon = document.querySelectorAll('.icon-heart');
    if (buttonClick.nodeName !== 'BUTTON') return false;

    if (buttonClick.classList.contains('icon-heart-wihte')) {

        buttonClick.classList.toggle('isInvisible');
        
        // heartIcon.forEach(e => {
            
        //     e.classList.toggle('isInvisible');
        // });

        
    }
  });