import { openModal, closeModal } from './modal-control';
import advModalTpl from '../templates/new-modal-advert.hbs';
import * as API from '../lib/api';

const btnCreateAvert = document.querySelector('.header__create-btn');
btnCreateAvert.addEventListener('click', openAdvModal);

function openAdvModal(e) {
  openModal(advModalTpl());
  const advForm = document.querySelector('.form-modal-adv');
  const imgInput = document.querySelector('.containerImgg_inp');
  const containerImg = document.querySelector('.containerImg');

  advForm.addEventListener('submit', onSubmit);
  const picArr = [];
  let picId = 0;

  containerImg.addEventListener('click', onClickRemove);
  function onClickRemove(e) {
    const imgShell = e.target.closest('Div');
    if (!imgShell?.classList.contains('containerImgg')) {
      return;
    }

    const indexPicToRemove = picArr.findIndex(e => e.id === imgShell.dataset.id);
    picArr.splice(indexPicToRemove, 1);
    imgShell.remove();
  }

  imgInput.addEventListener('change', e => {
    if (containerImg.children.length < 6) {
      if (!e.target.files.length) return;
      const files = Array.from(e.target.files);
      console.log(e.target.files);

      files.forEach(file => {
        if (!file.type.match('image')) return;
        picArr.push({ id: picId, file });
        console.log(picArr);
        const reader = new FileReader();

        reader.onload = ev => {
          const src = ev.target.result;
          containerImg.insertAdjacentHTML(
            'afterbegin',
            `<div class="containerImgg" data-id="${picId}"> <img src="${src}" alt="${file.name}" class="newImg"/> </div>`,
          );
        };
        picId++;
        reader.readAsDataURL(file);
      });
    }
  });

  console.log(advForm.elements.category.value);

  function onSubmit(e) {
    e.preventDefault();
    if (containerImg.children.length < 2) {
      console.log('нужно добавить картинку');
      return;
    }

    const catagoryInput = advForm.elements.category.value;
    if (catagoryInput === 'work' || catagoryInput === 'trade' || catagoryInput === 'free') {
      if (!+advForm.elements.price.value) {
        console.log('Цена должна быть 0');
        return;
      }
    }

    const formData = new FormData(e.target);
    picArr.forEach(e => formData.append('file', e.file));
    console.log(formData.getAll('file'));

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
          console.log('Неверный формат изображения! Формат должен быть ".jpg, .jpeg, .png"');
        }
        if (data.id) {
          console.log('Обьявление добавлено');
          closeModal();
        }
      })
      .catch(console.log);
  }
}
