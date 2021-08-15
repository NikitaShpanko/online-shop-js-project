const inputNode = document.querySelector('#theme-switch-toggle');

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

let theme = localStorage.getItem('data-theme');

if (theme === Theme.DARK) {
  document.body.classList.add(Theme.DARK);
  inputNode.checked = true;
} else {
  document.body.classList.add(Theme.LIGHT);
}

inputNode.addEventListener('change', () => {
  let theme = localStorage.getItem('data-theme');
  if (theme === Theme.DARK) {
    localStorage.setItem('data-theme', Theme.LIGHT);
  } else {
    localStorage.setItem('data-theme', Theme.DARK);
  }
  document.body.classList.toggle(Theme.DARK);
  document.body.classList.toggle(Theme.LIGHT);
});
