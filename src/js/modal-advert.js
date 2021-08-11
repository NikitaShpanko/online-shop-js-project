import modalAdvert from '../templates/modal-advert.hbs';
document.querySelector('.modal-container').insertAdjacentHTML('beforebegin', modalAdvert());

const modalAnnouncement = document.querySelector('.announcement');

document.querySelector('.header__create-btn').addEventListener('click', () => {
  modalAnnouncement.classList.toggle('is-hidden');
});

document.querySelector('.modal-close-button').addEventListener('click', () => {
  modalAnnouncement.classList.toggle('is-hidden');
});

document.querySelectorAll('._hvr').forEach(node => {
  node.addEventListener('input', () => {
    input();
  });

  function input() {
    if (node.value == '') {
      node.style.border = '1px solid #ff0000';
    } else {
      node.style.border = '1px solid #bbbbbb';
    }
  }
});

const keys = {
  empty: '',
  estate: 'Недвижимость',
  Transport: 'Транспорт',
  work: 'Работа',
  electronics: 'Электроника',
  business: 'Бизнес и услуги',
  sports: 'Отдых и спорт',
  free: 'Отдам бесплатно',
  exchange: 'Обмен',
};

for (const key in keys) {
  const options = document.createElement('option');
  options.innerHTML = keys[key];
  document.querySelector('.form-modal-adv__select').appendChild(options);
}

const inputPeice = document.querySelector('.inpur-peice');
inputPeice.addEventListener('input', e => {
  inputPeice.value = inputPeice.value.replace(/[^\d-]/g, '');
});
