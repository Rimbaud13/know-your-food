import request from "request-promise";

async function migros(value: string) {
  const res = await request(`https://search-api.migros.ch/products?lang=fr&key=migros_components_search&limit=1&offset=0&q=${value}`);
  return JSON.parse(res).results.filter(x => x.type === 'product');
}

export default migros;
