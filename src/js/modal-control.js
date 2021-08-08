const modalContainer = document.querySelector('.modal-container');
modalContainer.addEventListener('click', onOpenModalClick);

export function openModal(modalForm) {
  modalContainer.innerHTML = modalForm();
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

export function closeModal() {
  window.removeEventListener('keydown', onOpenModalKeyPress);
  modalContainer.classList.toggle('is-hidden');
  document.body.classList.toggle('modal-open');
  modalContainer.innerHTML = '';
}
