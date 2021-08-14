import advModalEditTpl from '../templates/new-modal-advert-edit.hbs';
import * as API from '../lib/api';

function submitForm() {
  const advForm = document.querySelector('.form-modal-adv');
  const imgInput = document.querySelector('.containerImgg_inp');
  const containerImg = document.querySelector('.containerImg');

  advForm.addEventListener('submit', onSubmit);

  imgInput.addEventListener('change', e => {
    if (containerImg.children.length < 6) {
      if (!e.target.files.length) return;
      const files = Array.from(e.target.files);

      files.forEach(file => {
        if (!file.type.match('image')) return;

        const reader = new FileReader();

        reader.onload = ev => {
          const src = ev.target.result;
          containerImg.insertAdjacentHTML(
            'afterbegin',
            `<div class="containerImgg"> <img src="${src}" alt="${file.name}" class="newImg"/> </div>`,
          );
        };
        reader.readAsDataURL(file);
      });
    }
  });

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
    const id = advForm.dataset.id;
    console.log(id);

    fetch(`https://callboard-backend.goit.global/call${id}`, {
      method: 'P',
      body: formData,
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          console.log('Обьявление добавлено');
          closeModal();
        }
      })
      .catch(e => {
        if (e.status === 415) {
          console.log('Файл должен быть картинкой');
        }
      });
  }
}
