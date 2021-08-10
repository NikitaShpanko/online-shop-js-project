import modalCard from '../templates/modal-card.hbs';
import allCardCategoryTpl from '../templates/categories-allcard.hbs';
import { openModal, closeModal } from './modal-control';
import store from '../lib/store';
import * as API from '../lib/api';


const allCategorys = document.querySelector('body');
const mainNode = document.querySelector('#root');

allCategorys.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    const modalCard = e.target.classList.contains('card__img');
    const allCardCategory = e.target.classList.contains('categories__titel--link');

    // console.log(store.categories);
    
    if (buttonClick?.nodeName === 'BUTTON') {
        if (buttonClick.classList.contains('icon-heart-white'))
            buttonClick.classList.toggle('isFavorites')
        else if (buttonClick.classList.contains('icon-fullscreen'))
            openModalCard();
    };

    if (modalCard) openModalCard();
});

function buttonClickKard() {
    if (buttonClick.classList.contains('icon-heart-white')) { buttonClick.classList.toggle('isFavorites') }
    else if (buttonClick.classList.contains('icon-fullscreen')) { openModalCard() };
}
        


function openModalCard() {
        openModal(modalCard);
        }
function onSubmit(params) {
        closeModal();
}


