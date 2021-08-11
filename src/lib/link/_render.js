export async function renderSomething(data, linkData, keyword, hasAds) {
  const { pathList } = linkData;
  const pathIndex = pathList.indexOf(keyword);
  if (pathIndex > -1 && pathIndex < pathList.length - 1) {
    renderCategory(data?.getCategory(pathList[pathIndex + 1]), linkData);
  } else {
    renderData(data, linkData, hasAds);
  }
}

function renderData(data, linkData, hasAds) {
  console.log('DATA', data);
}

export function renderCategory(category, linkData) {
  console.log('CATEGORY', category);
}
