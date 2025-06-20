const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://cultivate25.mapyourshow.com/8_0/explore/exhibitor-categories.cfm#/', {
        waitUntil: 'networkidle0'
    });

    // Espera carregar os elementos de categoria
    await page.waitForSelector('h3.card-Title');

    // Extrai nome + link de cada categoria
    const categorias = await page.evaluate(() => {
        const baseUrl = "https://cultivate25.mapyourshow.com";
        return Array.from(document.querySelectorAll('h3.card-Title')).map(h3 => {
            const linkEl = h3.querySelector('a');
            const nome = linkEl?.textContent?.trim() || '';
            const href = linkEl?.getAttribute('href') || '';
            const urlCompleta = href.startsWith('http') ? href : baseUrl + href;
            return {
                nome,
                link: urlCompleta
            };
        });
    });

    const categoriasDesejadas = [
        "Annuals",
        "Aquatic plants",
        "Cut Flowers & Foilage",
        "Fruits, Vegetables & Herbs",
        "Groundcovers & Vines",
        "Native Plants",
        "Ornamental Grasses & Bamboo",
        "Perennials",
        "Plants" // pode ser nome completo ou trecho
    ];

    function filtrarCategorias(categorias, filtros) {
        console.log("🔍 Aplicando filtros:", filtros);
        console.log("📋 Total de categorias encontradas:", categorias.length);
        return categorias.filter(cat =>
            filtros.some(filtro =>
                cat.nome.toLowerCase().includes(filtro.toLowerCase())
            )
        );
    }

    // Aplica o filtro
    const categoriasFiltradas = filtrarCategorias(categorias, categoriasDesejadas);

    // Salva em novo arquivo (opcional)
    fs.writeFileSync('filtered_categories.json', JSON.stringify({ categorias: categoriasFiltradas }, null, 2), 'utf-8');

    console.log(`✅ ${categoriasFiltradas.length} categorias encontradas com os filtros definidos.`);


    for (let cat of categoriasFiltradas) {
        console.log(`categorias filtradas`, categoriasFiltradas)
        console.log(`📂 Categoria: ${cat.nome}`);
        for (let expositor of cat.nome) {
            console.log(`   🔍 Expositor: ${expositor.nome}`);
            try {
                const info = await extrairInfoExpositor(page, expositor.link);
                expositor.endereco = info.endereco;
                expositor.site = info.site;
                expositor.telefone = info.telefone;
                console.log(`      ✅ Dados coletados`);
            } catch (err) {
                console.warn(`      ⚠️ Erro ao coletar dados de ${expositor.nome}:`, err.message);
            }
        }
    }


    await browser.close();
})();



