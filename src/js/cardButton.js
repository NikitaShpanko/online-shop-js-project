import modalCard from '../templates/modal-card.hbs';
import { openModal, closeModal } from './modal-control';
import store from '../lib/store';
import * as API from '../lib/api';


const allCategorys = document.querySelector('body');

allCategorys.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    
    if (buttonClick?.nodeName !== 'BUTTON') return false;

    if (buttonClick.classList.contains('icon-heart-white') ) {
        buttonClick.classList.toggle('isFavorites');    
    }
    else if (buttonClick.classList.contains('icon-fullscreen')) {
        openModalCard();
        console.log(store.categories);
    }
});

function openModalCard() {
        openModal(modalCard);
        }
function onSubmit(params) {
        closeModal();
}


