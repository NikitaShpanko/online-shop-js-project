import { success, error } from '@pnotify/core';
import { openModal, closeModal } from './modal-control';
import advModalTpl from '../templates/new-modal-advert.hbs';
import * as API from '../lib/api';
import { openAuthModal } from './auth-form';
import * as Link from '../lib/link';

const btnCreateAvert = document.querySelector('.header__create-btn');
btnCreateAvert.addEventListener('click', openAdvModal);

function openAdvModal(e) {
  if (!localStorage.accessToken) {
    openAuthModal();
    return;
  }
  openModal(advModalTpl());
  const advForm = document.querySelector('.form-modal-adv');
  const imgInput = document.querySelector('.containerImgg_inp');
  const containerImg = document.querySelector('.containerImg');
  const containerLabel = document.querySelector('.containerImgg__label');

  advForm.addEventListener('submit', onSubmit);
  containerImg.addEventListener('click', onClickRemove);

  const picArr = [];
  let picId = 0;

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

  function onSubmit(e) {
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
    picArr.forEach(e => formData.append('file', e.file));

    fetch('https://callboard-backend.goit.global/call', {
      method: 'POST',
      body: formData,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.message === 'Only image files are allowed') {
          error({
            text: 'Неверный формат изображения! Формат должен быть ".jpg, .jpeg, .png"!',
            delay: 2000,
          });
        }
        if (data.id) {
          success({ text: 'Обьявление успешно добавлено', delay: 2000 });
          Link.goTo(location.href);
          closeModal();
        }
      })
      .catch(e => {
        error({ text: `${e}`, delay: 2000 });
      });
  }
}
