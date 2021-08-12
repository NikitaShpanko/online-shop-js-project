
//Возвращает массив выбранных категорий по URL
// или пустой массив, если не выбрано ничего
export default function getUrlCategories() {
  const queryParams = new URLSearchParams(window.location.search);
  let currentCategoriesUrl = queryParams.getAll('categories');
  if (currentCategoriesUrl.length === 0) {
    return [];
  } else {
    return currentCategoriesUrl[0].split(',');
  }
}
