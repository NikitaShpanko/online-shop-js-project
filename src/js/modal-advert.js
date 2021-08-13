// import modalAdvert from '../templates/modal-advert.hbs';
// import { openModal, closeModal } from './modal-control';

/////////////////////////////////////////////////////////////////////
const bac = document.querySelector('.add');
document.querySelector('.btn').addEventListener('click', () => {
  bac.classList.toggle('is-hidden');
});
document.querySelector('.modal-close-button').addEventListener('click', () => {
  bac.classList.toggle('is-hidden');
});
/////////////////////////////////////////////////////////////////////

// document.querySelector('.header__create-btn').addEventListener('click', () => {
//   openModal(modalAdvert());

//   document.querySelectorAll('._hvr').forEach(node => {
//     node.addEventListener('input', () => {
//       input();
//     });

//     function input() {
//       if (node.value == '') {
//         node.style.border = '1px solid #ff0000';
//       } else {
//         node.style.border = '1px solid #bbbbbb';
//       }
//     }
//   });

//   const keys = {
//     empty: '',
//     estate: 'Недвижимость',
//     Transport: 'Транспорт',
//     work: 'Работа',
//     electronics: 'Электроника',
//     business: 'Бизнес и услуги',
//     sports: 'Отдых и спорт',
//     free: 'Отдам бесплатно',
//     exchange: 'Обмен',
//   };

//   for (const key in keys) {
//     const options = document.createElement('option');
//     options.innerHTML = keys[key];
//     document.querySelector('.form-modal-adv__select').appendChild(options);
//   }

//   const inputPrice = document.querySelector('.input-price');
//   inputPrice.addEventListener('input', () => {
//     inputPrice.value = inputPrice.value.replace(/[^\d-]/g, '');
//   });
// });
const inp = document.querySelector('.containerImgg_inp');
const containerImg = document.querySelector('.containerImg');
const chang = e => {
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
};
inp.addEventListener('change', chang);

