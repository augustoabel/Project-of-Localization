// updateJson.js (COM PUPPETEER)
const fs = require('fs');
const puppeteer = require('puppeteer'); // Importa Puppeteer
const cheerio = require('cheerio'); // Ainda útil para parsing rápido do HTML

// Caminhos dos arquivos JSON
const inputJsonPath = 'new_data_customers.json';
const outputJsonPath = 'updated_exhibitors_data.json';

async function fetchDataAndAugmentJson() {
    let exhibitorsData = [];
    let browser; // Declara a variável browser fora do try para que possa ser fechada no finally

    try {
        // 1. Ler o JSON de entrada
        const rawData = fs.readFileSync(inputJsonPath, 'utf8');
        exhibitorsData = JSON.parse(rawData);
        console.log(`Lidos ${exhibitorsData.length} expositores do arquivo.`);
    } catch (error) {
        console.error(`Erro ao ler ou parsear o arquivo JSON: ${inputJsonPath}`, error);
        return;
    }

    const updatedExhibitors = [];

    try {
        // 2. Iniciar o navegador Puppeteer (headless por padrão)
        browser = await puppeteer.launch({
            headless: true, // true para não abrir janela do navegador; 'new' para abrir uma nova janela
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recomentado para ambientes Linux/servidores
        });

        for (const exhibitor of exhibitorsData) {
            console.log(`Processando: <span class="math-inline">\{exhibitor\.nome\} \(</span>{exhibitor.link})`);
            let aboutText = null;
            let boothName = null;
            let boothLink = null;

            if (exhibitor.link) {
                const page = await browser.newPage();
                // Define um tempo limite maior, caso a página demore a carregar
                page.setDefaultNavigationTimeout(60000); // 60 segundos

                try {
                    // Navegar para a URL e esperar que a rede fique inativa ou o DOM esteja completo
                    await page.goto(exhibitor.link, { waitUntil: 'networkidle2' });
                    // 'networkidle2' espera que não haja mais de 2 requisições de rede por 500ms.
                    // Outras opções: 'domcontentloaded', 'load', 'networkidle0'

                    // Opcional: Adicione um pequeno atraso se a página tiver animações ou carregamentos muito lentos
                    // await page.waitForTimeout(2000); // Espera 2 segundos

                    // Pegar o HTML completo da página depois de todo o JS ter sido executado
                    const content = await page.content();
                    const $ = cheerio.load(content); // Carrega o HTML no Cheerio

                    // 3. Extrair o texto "about"
                    // Simplificado para pegar da div principal, como discutimos
                    const aboutElement = $('#section-description .line-clamp__10');
                    if (aboutElement.length) {
                        aboutText = aboutElement.text().trim();
                    } else {
                        // Este log te dirá se o seletor de "about" não está encontrando nada mesmo após JS
                        console.log('  - Seletor #section-description .line-clamp__10 não encontrado APÓS carregamento JS.');
                        // console.log('  - Conteúdo HTML para debug:', content); // Descomente para ver o HTML completo
                    }

                    // 4. Extrair o nome do lugar da mesa e o link
                    const floorplanLinkElement = $('#newfloorplanlink');
                    if (floorplanLinkElement.length) {
                        boothName = floorplanLinkElement.text().trim();
                        boothLink = floorplanLinkElement.attr('href');
                    } else {
                        console.log('  - Seletor #newfloorplanlink não encontrado APÓS carregamento JS.');
                    }

                    console.log(`  - About: ${aboutText ? 'Encontrado' : 'Não encontrado'}`);
                    console.log(`  - Mesa: ${boothName ? `${boothName} (${boothLink})` : 'Não encontrado'}`);

                } catch (crawlError) {
                    console.error(`Erro ao navegar ou extrair dados de ${exhibitor.link}:`, crawlError.message);
                } finally {
                    await page.close(); // Sempre feche a página após usá-la
                }
            } else {
                console.log(`  - Sem link para ${exhibitor.nome}. Pulando coleta de dados.`);
            }

            // Adicionar as novas informações ao objeto do expositor
            updatedExhibitors.push({
                ...exhibitor,
                about: aboutText,
                booth_name: boothName,
                booth_link: boothLink
            });
        }

    } catch (browserError) {
        console.error("Erro ao iniciar ou usar o navegador Puppeteer:", browserError);
    } finally {
        // 6. Salvar o JSON atualizado em um novo arquivo
        try {
            fs.writeFileSync(outputJsonPath, JSON.stringify(updatedExhibitors, null, 2), 'utf8');
            console.log(`Dados atualizados salvos em: ${outputJsonPath}`);
        } catch (writeError) {
            console.error(`Erro ao salvar o arquivo JSON atualizado: ${outputJsonPath}`, writeError);
        }

        if (browser) {
            await browser.close(); // 7. Sempre feche o navegador no final
            console.log("Navegador Puppeteer fechado.");
        }
    }
}

// Executar a função principal
fetchDataAndAugmentJson();