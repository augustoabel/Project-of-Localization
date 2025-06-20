// CommonJS version (sem "type": "module")
const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');


// Ajuste esse caminho conforme necessário
const pathClientes = path.resolve('../Customers - JSON/scottCustomer.json');
// const pathEmpresas = path.resolve('../JS - Automation/categories_with_exhibitors_with_coords.json');
const pathEmpresas = path.resolve('./result6.json'); // Caminho para o JSON com expositores

const LIMIAR = 0.8;

const normalizeName = (name) =>
  name.toUpperCase().replace(/\s+/g, '').trim();

const verificarEmpresasNaoClientes = () => {
  const clientesRaw = fs.readFileSync(pathClientes, 'utf-8');
  const empresasRaw = fs.readFileSync(pathEmpresas, 'utf-8');

  const clientes = JSON.parse(clientesRaw);
  const empresasData = JSON.parse(empresasRaw);
  console.log("📊 Primeiras 5 empresas:", empresasData.slice(0, 5));


  const nomesClientes = clientes.map(c => normalizeName(c.Company));
  const empresasNaoClientes = [];

    for (const expositor of empresasData) {
      const nomeExpositor = normalizeName(expositor.nome);
      const match = stringSimilarity.findBestMatch(nomeExpositor, nomesClientes);
      if (match.bestMatch.rating < LIMIAR) {
        empresasNaoClientes.push(expositor);
      }
    }

  return empresasNaoClientes;
};

// Execução
const resultado = verificarEmpresasNaoClientes();

fs.writeFileSync('result7.json', JSON.stringify(resultado, null, 2), 'utf-8');
console.log('Arquivo gerado com sucesso!');


//  for (const categoria of empresasData.categorias) {
//     for (const expositor of categoria.expositores) {
//       const nomeExpositor = normalizeName(expositor.nome);
//       const match = stringSimilarity.findBestMatch(nomeExpositor, nomesClientes);
//       if (match.bestMatch.rating < LIMIAR) {
//         empresasNaoClientes.push(expositor);
//       }
//     }
//   }

