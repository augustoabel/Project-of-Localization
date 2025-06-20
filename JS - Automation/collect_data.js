const puppeteer = require('puppeteer');
const fs = require('fs');

// ✅ Função para simular scroll até carregar todo o conteúdo
async function scrollAteCarregarTudo(page, delay = 1000, maxTentativas = 1) {
  let tentativasSemMudanca = 0;
  let totalAnterior = 0;

  while (tentativasSemMudanca < maxTentativas) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, delay));

    const totalAtual = await page.evaluate(() =>
      document.querySelectorAll('h3.card-Title').length
    );

    if (totalAtual === totalAnterior) {
      tentativasSemMudanca++;
    } else {
      tentativasSemMudanca = 0;
      totalAnterior = totalAtual;
    }
  }
}

// ✅ Função para extrair expositores de uma categoria
async function extrairExpositores(page, urlCategoria) {
  await page.goto(urlCategoria, { waitUntil: 'networkidle0' });
  await scrollAteCarregarTudo(page);
  await page.waitForSelector('h3.card-Title');

  const baseUrl = "https://cultivate25.mapyourshow.com";

  return await page.evaluate(() => {
    const baseUrl = "https://cultivate25.mapyourshow.com";
    return Array.from(document.querySelectorAll('h3.card-Title')).map(h3 => {
      const a = h3.querySelector('a');
      const span = a?.querySelector('span');
      const nome = (span?.textContent || a?.textContent || '').trim();
      const href = a?.getAttribute('href') || '';
      const link = href.startsWith('http') ? href : baseUrl + href;
      return { nome, link };
    });
  });
}

// ✅ Função para extrair endereço, site e telefone do expositor
async function extrairInfoExpositor(page, urlExpositor) {
  await page.goto(urlExpositor, { waitUntil: 'networkidle0' });
  await page.waitForSelector('div.column.contact-info');

  return await page.evaluate(() => {
    const addressEl = document.querySelector('address');
    const endereco = addressEl
      ? Array.from(addressEl.querySelectorAll('p')).map(p => p.textContent.trim()).filter(Boolean)
      : [];

    const siteEl = document.querySelector('div.column.contact-info ul.list__icons.f4 li a');
    const site = siteEl?.href || '';

    const lista = document.querySelectorAll('div.column.contact-info ul.list__icons li');
    const telefoneLi = lista[1]; // segundo item
    const telefone = telefoneLi?.textContent?.trim() || '';

    return { endereco, site, telefone };
  });
}

// ✅ Função principal que percorre todas as categorias
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--start-maximized'],
    defaultViewport: null
  });

  const page = await browser.newPage();

  const dados = JSON.parse(fs.readFileSync('filtered_categories.json', 'utf-8'));
  const categorias = dados.categorias;
  console.log("categorias", categorias.length);
  for (let cat of categorias) {
    console.log(`📂 Coletando expositores da categoria: ${cat.nome}`);

    try {
      const expositores = await extrairExpositores(page, cat.link);
      cat.expositores = [];
      for (let expositor of expositores) {
        console.log(`   🔍 Buscando info de: ${expositor.nome}`);
        try {
          const info = await extrairInfoExpositor(page, expositor.link);
          expositor.endereco = info.endereco;
          expositor.site = info.site;
          expositor.telefone = info.telefone;
          cat.expositores.push(expositor);
          console.log(`      📌 Telefone: ${expositor.telefone}`)  ;
          console.log(`      📌 Site: ${expositor.site}`) ;
          console.log(`      ✅ OK`);
        } catch (err) {
          console.warn(`      ⚠️ Erro ao acessar expositor: ${err.message}`);
        }
      }
      console.log(`📦 Total de expositores na categoria "${cat.nome}": ${cat.expositores.length}`);
    } catch (err) {
      console.warn(`⚠️ Erro na categoria ${cat.nome}: ${err.message}`);
    }
  }

  fs.writeFileSync('categories_with_exhibitors_data.json', JSON.stringify({ categorias }, null, 2), 'utf-8');
  await browser.close();
})();
