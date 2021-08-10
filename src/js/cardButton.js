import modalCard from '../templates/modal-card.hbs';
import allCardCategoryTpl from '../templates/categories-allcard.hbs';
import cardCategoryTpl from '../templates/categories-allcard.hbs';
import { openModal, closeModal } from './modal-control';
// import Handlebars from 'handlebars';

// Handlebars.registerHelper ('loud', function(cardsvg) {
//  return '<use href="./images/sprite.svg#icon-arrow_left"></use>';
// })

// const html = cardCategoryTpl(Handlebars);


const bodyNode = document.querySelector('body');

bodyNode.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    const cardId = e.target.closest('.card__all--content');
    e.preventDefault();
    
    if (buttonClick?.nodeName === 'BUTTON') {
        if (buttonClick.classList.contains('icon-heart-white')) {
            buttonClick.classList.toggle('isFavorites');
            console.log("добавить товар в избранное");
        }
            
        else if (buttonClick.classList.contains('icon-fullscreen'))
            openModalCard(cardId.dataset.id);
        else if (buttonClick.classList.contains('load__more--button'))
            console.log("Загрузка следующей страницы ");
        else if (buttonClick.classList.contains('button__arow--left'))
            console.log("Товар слева");
        else if (buttonClick.classList.contains('button__arow-right'))
            console.log("Товар справа");
        else if (buttonClick.classList.contains('categories__titel--allCard'))
            console.log("Загружается шаблон со всеми карточками");
    };

    if (cardId && buttonClick?.nodeName !== 'BUTTON') openModalCard(cardId.dataset.id);
});

 
function openModalCard(id) {
    openModal(modalCard());
}
    
function onSubmit(params) {
    closeModal();
}


