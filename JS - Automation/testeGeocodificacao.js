// arquivo: geocodificaEnderecos.js

import fs from 'fs/promises';
import fetch from 'node-fetch'; // Node < 18: npm install node-fetch
const pathInput = './categories_with_exhibitors_data.json'; // <- seu caminho aqui
const pathOutput = './categories_with_exhibitors_with_coords.json';

// Geocodificação com Nominatim
const getLatLng = async (enderecoTexto) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoTexto)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'cultivate-geocoder'
    }
  });
  const data = await response.json();
  return data.length > 0
    ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    : null;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processarArquivo = async () => {
  const raw = await fs.readFile(pathInput, 'utf-8');
  const json = JSON.parse(raw);

  for (const categoria of json.categorias) {
    for (const expositor of categoria.expositores) {
      const enderecoTexto = Array.isArray(expositor.endereco)
        ? expositor.endereco.join(', ')
        : expositor.endereco;

      console.log(`📍 Geocodificando: ${expositor.nome} → ${enderecoTexto}`);

      try {
        const coords = await getLatLng(enderecoTexto);
        expositor.lat = coords?.lat || null;
        expositor.lng = coords?.lng || null;
        console.log(`✔️ Coordenadas: ${expositor.lat}, ${expositor.lng}`);
      } catch (err) {
        console.error(`❌ Erro em ${expositor.nome}:`, err);
        expositor.lat = null;
        expositor.lng = null;
      }

      await sleep(1000); // Nominatim recomenda 1 req/segundo
    }
  }

  await fs.writeFile(pathOutput, JSON.stringify(json, null, 2), 'utf-8');
  console.log(`✅ Arquivo salvo em ${pathOutput}`);
};

processarArquivo();
