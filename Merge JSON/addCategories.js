// CommonJS version (sem "type": "module")
const fs = require('fs');
const path = require('path');

// --- JSON 1: Novos Clientes (Expositores sem Categoria) ---
const novosClientesPath = path.resolve('./result7.json');
// Garante que o arquivo existe antes de tentar ler
if (!fs.existsSync(novosClientesPath)) {
    console.error(`Erro: Arquivo não encontrado em ${novosClientesPath}`);
    process.exit(1); // Sai do script com erro
}
const novosClientes = JSON.parse(fs.readFileSync(novosClientesPath, 'utf8'));

// --- JSON 2: Todos os Clientes Agrupados por Categorias (o JSON "velho") ---
const todosClientesPath = path.resolve('../JS - Automation/categories_with_exhibitors_with_coords.json');
// Garante que o arquivo existe antes de tentar ler
if (!fs.existsSync(todosClientesPath)) {
    console.error(`Erro: Arquivo não encontrado em ${todosClientesPath}`);
    process.exit(1); // Sai do script com erro
}
const todosClientes = JSON.parse(fs.readFileSync(todosClientesPath, 'utf8'));

// --- Lógica para processar e criar o novo JSON ---

// 1. Criar um mapa (Map) de nomes de expositores para suas categorias
const expositorToCategoriaMap = new Map();

// Adiciona verificações mais robustas para garantir que as estruturas existam
if (todosClientes && Array.isArray(todosClientes.categorias)) {
    todosClientes.categorias.forEach(categoria => {
        if (categoria && Array.isArray(categoria.expositores)) {
            categoria.expositores.forEach(expositor => {
                // Apenas verifica se o expositor e seu nome existem para mapear a categoria
                if (expositor && expositor.nome) {
                    if (!expositorToCategoriaMap.has(expositor.nome)) {
                        expositorToCategoriaMap.set(expositor.nome, categoria.nome);
                    }
                }
            });
        }
    });
} else {
    console.warn("Aviso: 'todosClientes' ou 'todosClientes.categorias' está indefinido, nulo ou não é um array. Nenhuma categoria será mapeada.");
}


// 2. Processar os 'novosClientes' e adicionar a informação da categoria
// IMPORTANTE: Removemos o .filter(expositor => expositor.lat && expositor.lng)
// Isso garante que todos os expositores do 'novosClientes' sejam incluídos,
// independentemente de terem lat/lng ou de serem nulos.
const novoJsonComCategorias = (Array.isArray(novosClientes) ? novosClientes : []) // Garante que novosClientes é um array
  .map(novoExpositor => {
    // Busca a categoria. Se não encontrar, define como 'Não Categorizado'.
    const categoriaNome = novoExpositor && novoExpositor.nome
                          ? expositorToCategoriaMap.get(novoExpositor.nome) || 'Não Categorizado'
                          : 'Não Categorizado'; // Caso o expositor ou nome não exista no novo JSON

    return {
      ...novoExpositor, // Espalha todas as propriedades existentes, incluindo nulls
      categoria: categoriaNome // Adiciona ou sobrescreve a propriedade 'categoria'
    };
  });

// --- Saída do Novo JSON ---
const fileName = "new_data_customers.json"; // Define fileName aqui
fs.writeFileSync(fileName, JSON.stringify(novoJsonComCategorias, null, 2));
console.log(`Novo JSON salvo em: ${fileName}`);