const inputsNode = document.querySelectorAll('.theme-switch__toggle');

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

let theme = localStorage.getItem('data-theme');

if (theme === Theme.DARK) {
  document.body.classList.add(Theme.DARK);
  inputsNode[0].checked = true;
  inputsNode[1].checked = true;
} else {
  document.body.classList.add(Theme.LIGHT);
}

inputsNode.forEach(inputNode => {
  inputNode.addEventListener('change', () => {
    // debugger;
    let theme = localStorage.getItem('data-theme');
    if (theme === Theme.DARK) {
      localStorage.setItem('data-theme', Theme.LIGHT);
      inputsNode[0].checked = false;
      inputsNode[1].checked = false;
    } else {
      localStorage.setItem('data-theme', Theme.DARK);
      inputsNode[0].checked = true;
      inputsNode[1].checked = true;
    }
    document.body.classList.toggle(Theme.DARK);
    document.body.classList.toggle(Theme.LIGHT);
  });
});
