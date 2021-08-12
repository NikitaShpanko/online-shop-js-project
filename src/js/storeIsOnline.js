export default function storeIsOnline() {
  const headerRegContiner = document.querySelectorAll('[data-account-registration]');
  const headerCabContiner = document.querySelectorAll('[data-account-user]');
  headerRegContiner.forEach(e => e.classList.toggle('reg-is-hidden'));
  headerCabContiner.forEach(e => e.classList.toggle('cab-is-hidden'));
}
