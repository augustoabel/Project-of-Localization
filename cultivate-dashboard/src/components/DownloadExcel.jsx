// src/components/DownloadExcel.jsx
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel } from 'react-icons/fa'; 

const DownloadExcel = ({ data, fileName = 'expositores_data' }) => {

  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("Não há dados para exportar!");
      return;
    }

    const wsData = data.map(expositor => ({
      Nome: expositor.nome || '',
      Categoria: expositor.categoria || 'Não Categorizado',
      Link: expositor.link || '',
      Endereco: Array.isArray(expositor.endereco) ? expositor.endereco.join(', ') : (expositor.endereco || ''),
      Site: expositor.site || '',
      Telefone: expositor.telefone || '',
      Latitude: expositor.lat || '',
      Longitude: expositor.lng || ''
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expositores");

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center space-x-2" // Adicionado flexbox e espaçamento
    >
      <FaFileExcel className="text-xl" />
      <span className='text-sm align-middle'>Download Exhibitors Sheet</span>
    </button>
  );
};

export default DownloadExcel;