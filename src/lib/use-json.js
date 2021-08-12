export function loadJSON(key) {
  try {
    const serializedState = localStorage.getItem(key);
    return !serializedState ? false : JSON.parse(serializedState);
  } catch (err) {
    console.error('Get state error: ', err);
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Set state error: ', err);
  }
}
