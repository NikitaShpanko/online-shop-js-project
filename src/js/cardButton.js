import modalCard from '../templates/modal-card.hbs';
import modalAdvertEditTpl from '../templates/new-modal-advert-edit.hbs';
import { success, error } from '@pnotify/core';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';
import { async } from 'q';
import * as Link from '../lib/link';
import { openAuthModal } from './auth-form';

const bodyNode = document.querySelector('body');

bodyNode.addEventListener('click', e => {
  const buttonClick = e.target.closest('button');
  const cardId = e.target.closest('.card__article');
  const cardIdModal = e.target.closest('.modal-card-conteiner');
  const formIdModal = e.target.closest('.form-modal-adv');
  const cardModalPatch = e.target.closest('.form-modal-push');
  const cardModalDelete = e.target.closest('.form-modal-edit');
  const imgPrev = e.target.closest('.modal-card--poiner');

  if (buttonClick?.nodeName === 'BUTTON') {
    if (buttonClick.classList.contains('icon-heart-white')) {
      if (!localStorage.accessToken) return Link.loginRedirect(); // openAuthModal();
      const getCardId = cardId.dataset.id;
      buttonClick.classList.toggle('isFavorites');
      if (buttonClick.classList.contains('isFavorites')) postIsFavoritesCard(getCardId);
      else deleteIsFavoritesCard(getCardId);
      const card = store.products.getCard(getCardId);
      card.isFavorites = !card.isFavorites;
    }
    if (buttonClick.classList.contains('icon-fullscreen')) {
      const getUserId = cardId.dataset.userid;
      const getId = cardId.dataset.id;
      const infoUser = store.isOnline;
      const data = store.products.getCard(getId);
      if (infoUser.id === getUserId) openModal(modalAdvertEditTpl({ data }));
      else openModalCard(cardId.dataset.id);
    } else if (buttonClick.classList.contains('modal-card--bnInfo')) {
      e.target.classList.toggle('isDispleyNone');
      document.querySelector('.modal-card--userInfo').classList.toggle('isDispleyNone');
    } else if (buttonClick.classList.contains('modal-card--buttonToShare')) {
      navigator.clipboard
        .writeText(location.href)
        .then(() => {
          success({ text: 'Ссылка скопирована в буфер обмена', delay: 2000 });
        })
        .catch(() => {
          error({ text: 'Не удалось скопировать ссылку в буфер обмена', delay: 2000 });
        });
    }

    if (buttonClick.classList.contains('modal-card--buttonIsFavorite')) {
      if (!localStorage.accessToken) {
        const href = location.href;
        closeModal(modalCard());
        //openAuthModal();
        return Link.loginRedirect(href);
      }
      const getCardId = cardIdModal.dataset.id;
      buttonClick.classList.toggle('isFavorites');

      store.products.getCard(getCardId).isFavorites =
        !store.products.getCard(getCardId).isFavorites;
      const cardElement = document.querySelector(`[data-id="${getCardId}"]`);
      if (cardElement) {
        const iconHeart = cardElement.querySelector('.icon-heart-white');
        if (iconHeart) {
          iconHeart.classList.toggle('isFavorites');
        }
      }

      if (buttonClick.classList.contains('isFavorites')) {
        postIsFavoritesCard(getCardId);
      } else {
        deleteIsFavoritesCard(getCardId);
      }
    }
  }

  if (cardId && buttonClick?.nodeName !== 'BUTTON') {
    const getUserId = cardId.dataset.userid;
    const getId = cardId.dataset.id;
    const infoUser = store.isOnline;
    const data = store.products.getCard(getId);

    if (infoUser.id === getUserId) {
      openModal(modalAdvertEditTpl({ data }));
      const advForm = document.querySelector('.form-modal-adv');
      const imgInput = document.querySelector('.containerImgg_inp');
      const containerImg = document.querySelector('.containerImg');
      const containerLabel = document.querySelector('.containerImgg__label');

      const allCategoryNode = document.querySelectorAll('.form-modal-adv__select option');
      const nowCategoryNode = document.querySelector('.form-modal-adv__select');

      allCategoryNode.forEach(e => {
        if (nowCategoryNode.dataset.category === e.value) e.setAttribute('selected', 'selected');
      });

      const initIndex = containerImg.children.length - 1;
      const picArr = [];
      let picId = initIndex;

      (() => {
        const oldImg = containerImg.querySelectorAll('.old-image-from-backend');
        oldImg.forEach(e => {
          const id = +e.dataset.id;
          const imageUrls = e.querySelector('img').src;
          picArr.push({ id, imageUrls });
        });
      })();

      containerImg.addEventListener('click', onClickRemove);
      function onClickRemove(e) {
        const imgShell = e.target.closest('Div');
        if (!imgShell?.classList.contains('containerImgg')) {
          return;
        }
        const indexPicToRemove = picArr.findIndex(e => e.id === +imgShell.dataset.id);
        picArr.splice(indexPicToRemove, 1);
        imgShell.remove();
      }

      imgInput.addEventListener('change', e => {
        if (!e.target.files.length) return;
        if (e.target.files.length + picArr.length > 5) {
          error({ text: 'Максимум 5 изображений должно быть!', delay: 2000 });
          return;
        }
        const files = Array.from(e.target.files);

        files.forEach(file => {
          if (!file.type.match('image')) return;
          picArr.push({ id: picId, file });
          imgInput.value = '';
          const reader = new FileReader();

          reader.onload = ev => {
            const src = ev.target.result;
            containerLabel.insertAdjacentHTML(
              'beforebegin',
              `<div class="containerImgg" data-id="${picId}"> <img src="${src}" alt="${file.name}" class="newImg"/> </div>`,
            );
            picId++;
          };

          reader.readAsDataURL(file);
        });
      });

      advForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!picArr.length) {
          error({ text: 'Нужно добавить изображение товара!', delay: 2000 });
          return;
        }

        const catagoryInput = advForm.elements.category.value;
        if (catagoryInput === 'work' || catagoryInput === 'trade' || catagoryInput === 'free') {
          if (+advForm.elements.price.value) {
            error({
              text: 'Для категорий: работа, обмен, отдам бесплатно - цена должна быть 0',
              delay: 2000,
            });
            return;
          }
        }

        const formData = new FormData(e.target);
        const urlImgArr = picArr.filter(item => item.imageUrls).map(item => item.imageUrls);

        formData.append('imageUrls', JSON.stringify(urlImgArr));
        picArr.forEach(e => {
          if (e.file) {
            formData.append('file', e.file);
          }
        });

        const id = advForm.dataset.id;
        fetchPatch(id, formData);
      });
    } else openModalCard(cardId.dataset.id);
  }
  if (cardModalDelete) {
    const id = formIdModal.dataset.id;
    deleteCard(id);
  }

  if (imgPrev) {
    const imgSrcPrev = e.target.getAttribute('src');
    document.querySelector('.modal-card--imgCard').setAttribute('src', imgSrcPrev);
  }
});

export function openModalCard(id) {
  history.pushState(null, null, `${location.href}#${id}`);
  const data = store.products.getCard(id);
  const dataUserId = data.userId;
  const cardIsFavorites = data.isFavorites;

  const userIdObj = API.request(`/user/${dataUserId}`).then(id => {
    const obj = { ...data, ...id };
    openModal(modalCard({ obj }));

    const modalIsFavoriteNode = document.querySelector('.modal-card--buttonIsFavorite');
    if (cardIsFavorites) modalIsFavoriteNode.classList.add('isFavorites');
  });
}

// function onSubmit(params) {
//   closeModal();
// }

async function postIsFavoritesCard(getCardId) {
  return API.request(`/call/favourite/${getCardId}`, 'POST', false, localStorage.accessToken);
}

async function deleteIsFavoritesCard(getCardId) {
  return API.request(`/call/favourite/${getCardId}`, 'DELETE', false, localStorage.accessToken);
}

// function updateURL(url) {
//   if (history.pushState) {
//     const baseUrl =
//       window.location.protocol + '//' + window.location.host + window.location.pathname;
//     const newUrl = baseUrl + url;
//     history.pushState(null, null, newUrl);
//   }
// }

async function user() {
  return API.request(`/user`, 'GET', false, localStorage.accessToken);
}

function fetchPatch(id, getCard) {
  fetch(`https://callboard-backend.goit.global/call/${id}`, {
    method: 'PATCH',
    body: getCard,
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${localStorage.accessToken}`,
    },
  })
    .then(r => r.json())
    .then(data => {
      if (data.id) {
        success({ text: 'Обьявление успешно отредактированно', delay: 2000 });
        closeModal();
        Link.goTo(location.href);
      }
    })
    .catch(console.log);
}

async function deleteCard(id) {
  const data = await API.request(`/call/${id}`, 'DELETE', false, localStorage.accessToken, false);
  success({ text: 'Обьявление успешно удаленно', delay: 2000 });
  closeModal();
  Link.goTo(location.href);
}
