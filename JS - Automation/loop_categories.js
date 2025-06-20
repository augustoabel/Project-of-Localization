const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Carrega as categorias filtradas
  const dados = JSON.parse(fs.readFileSync('filtered_categories.json', 'utf-8'));
  const categorias = dados.categorias;
  console.log(`Categorias carregadas: ${categorias.nome}`);

  // Função de extração já criada acima
  async function extrairExpositores(page, urlCategoria) {
    await page.goto(urlCategoria, { waitUntil: 'networkidle0' });
    await page.waitForSelector('h3.card-Title');
    const baseUrl = "https://cultivate25.mapyourshow.com";

    return await page.evaluate(() => {
      const baseUrl = "https://cultivate25.mapyourshow.com";
      return Array.from(document.querySelectorAll('h3.card-Title')).map(h3 => {
        const a = h3.querySelector('a');
        const span = a?.querySelector('span.normal');
        const nome = span?.textContent || '';
        const href = a?.getAttribute('href') || '';
        const link = href.startsWith('http') ? href : baseUrl + href;
        return { nome, link };
      });
    });
  }

  // Itera sobre cada categoria e adiciona os expositores
  for (let cat of categorias) {
    console.log(`🔍 Buscando expositores de: ${cat.nome}`);
    try {
      const expositores = await extrairExpositores(page, cat.link);
      cat.expositores = expositores;
      console.log(`✅ ${expositores.length} encontrados`);
    } catch (err) {
      console.warn(`⚠️ Erro ao carregar ${cat.nome}:`, err.message);
      cat.expositores = [];
    }
  }

  // Salva novo JSON com expositores
  fs.writeFileSync('categories_with_exhibitors.json', JSON.stringify({ categorias }, null, 2), 'utf-8');

  await browser.close();
})();
