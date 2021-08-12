import modalCard from '../templates/modal-card.hbs';
import allCardCategoryTpl from '../templates/categories-allcard.hbs';
import cardCategoryTpl from '../templates/categories-allcard.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';
import { from } from 'form-data';

const mainNode = document.querySelector('main');

mainNode.addEventListener('click', e => {
  const buttonClick = e.target.closest('button');
  const cardId = e.target.closest('.card__article');
  const imgPrev = e.target.closest('.modal-card--poiner');

  if (buttonClick?.nodeName === 'BUTTON') {
    if (buttonClick.classList.contains('icon-heart-white')) {
      buttonClick.classList.toggle('isFavorites');
      console.log('добавить товар в избранное');
    } else if (buttonClick.classList.contains('icon-fullscreen')) openModalCard(cardId.dataset.id);
    else if (buttonClick.classList.contains('load__more--button'))
      console.log('Загрузка следующей страницы ');
    else if (buttonClick.classList.contains('button__arow--left')) console.log('Товар слева');
    else if (buttonClick.classList.contains('button__arow-right')) console.log('Товар справа');
    else if (buttonClick.classList.contains('categories__titel--allCard'))
      console.log('Загружается шаблон со всеми карточками');
    else if (buttonClick.classList.contains('modal-card--buttonIsFavorite'))
      console.log('Добавление товара в избранное');
    else if (buttonClick.classList.contains('modal-card--bnInfo')) {
      e.target.classList.toggle('isDispleyNone');
      document.querySelector('.modal-card--userInfo').classList.toggle('isDispleyNone');
    } else if (buttonClick.classList.contains('modal-card--buttonToShare'))
      console.log('Поделиться товаром с дрзьями чере социальные сети (допустим)');
  }

  if (cardId && buttonClick?.nodeName !== 'BUTTON') {
    openModalCard(cardId.dataset.id);
  }

  if (imgPrev) {
    const imgSrcPrev = e.target.getAttribute('src');
    document.querySelector('.modal-card--imgCard').setAttribute('src', imgSrcPrev);
  }
});

function openModalCard(id) {
  const data = store.products.getCard(id);
  openModal(modalCard({ data }));
}

function onSubmit(params) {
  closeModal();
}
