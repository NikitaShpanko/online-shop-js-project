export default function deleteHash() {
  const href = location.href;
  const hashIndex = href.indexOf('#');
  if (hashIndex < 0) return;
  history.pushState(null, null, href.slice(0, hashIndex));
}
