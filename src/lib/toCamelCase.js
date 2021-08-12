export default function toCamelCase(str) {
  let newStr = '';
  let isUp = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == ' ') {
      isUp = true;
    } else {
      newStr += isUp ? str[i].toUpperCase() : str[i];
      isUp = false;
    }
  }
  return newStr;
}
