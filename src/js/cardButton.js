import modalCard from '../templates/modal-card.hbs';
import { openModal, closeModal } from './modal-control';

const allCategorys = document.querySelector('body');

allCategorys.addEventListener('click', (e) => {
    const buttonClick = e.target.closest('button');
    if (buttonClick.nodeName !== 'BUTTON') return false;

    if (buttonClick.classList.contains('icon-heart-white')) {

        buttonClick.classList.toggle('isFavorites');    
    }
});
  


const openBtnCard = document.querySelectorAll('.header__logo');
console.log(openBtnCard);

openBtnCard.forEach(e => e.addEventListener('click', openModalCard));

function openModalCard() {
  openModal(modalCard);
}