import { deleteHash } from '../lib/link';

const modalContainer = document.querySelector('.modal-container');
modalContainer.addEventListener('mousedown', onOpenModalClick);

export function openModal(modalForm) {
  modalContainer.innerHTML = modalForm;
  window.addEventListener('keyup', onOpenModalKeyPress);
  setTimeout(toggleClass, 50);
}

export function closeModal() {
  window.removeEventListener('keyup', onOpenModalKeyPress);
  toggleClass();
  modalContainer.innerHTML = '';
  deleteHash();
}

function toggleClass() {
  modalContainer.classList.toggle('is-hidden');
  document.body.classList.toggle('modal-open');
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
