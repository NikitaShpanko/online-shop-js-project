import authModal from '../templates/authorization-form.hbs';

const openBtn = document.querySelectorAll('.header__account-link');
const modalContainer = document.querySelector('.modal-container');

openBtn.forEach(e => e.addEventListener('click', openAuthModal));
modalContainer.addEventListener('click', onOpenModalClick);

function openAuthModal() {
  modalContainer.innerHTML = authModal();
  document.body.classList.toggle('modal-open');
  window.addEventListener('keydown', onOpenModalKeyPress);
  setTimeout(() => {
    modalContainer.classList.toggle('is-hidden');
  }, 0);
}

function onOpenModalClick(e) {
  if (
    !e.target.classList.contains('backdrop') &&
    !e.target.closest('Button')?.classList.contains('modal-close-button')
  ) {
    return;
  }
  closeModal();
}

function onOpenModalKeyPress({ code }) {
  if (code === 'Escape') {
    closeModal();
  }
}

function closeModal() {
  window.removeEventListener('keydown', onOpenModalKeyPress);
  modalContainer.classList.toggle('is-hidden');
  document.body.classList.toggle('modal-open');
  modalContainer.innerHTML = '';
}
