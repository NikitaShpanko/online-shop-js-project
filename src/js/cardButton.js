import modalCard from '../templates/modal-card.hbs';
import allCardCategoryTpl from '../templates/categories-allcard.hbs';
import { openModal, closeModal } from './modal-control';
import store from '../lib/store';
import * as API from '../lib/api';


const bodyNode = document.querySelector('body');
const mainNode = document.querySelector('#root');

mainNode.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    const cardId = e.target.closest('.card__all--content');
    
    if (buttonClick?.nodeName === 'BUTTON') {
        if (buttonClick.classList.contains('icon-heart-white'))
            buttonClick.classList.toggle('isFavorites')
        else if (buttonClick.classList.contains('icon-fullscreen'))
            openModalCard(cardId.dataset.id);
    };

    if (cardId && buttonClick?.nodeName !== 'BUTTON') openModalCard(cardId.dataset.id);
});
 
function openModalCard(id) {
    openModal(modalCard());
}
    
function onSubmit(params) {
    closeModal();
}


