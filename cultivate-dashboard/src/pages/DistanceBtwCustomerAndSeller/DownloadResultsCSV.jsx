import React from 'react';
import { FaFileExcel } from 'react-icons/fa'; 
const downloadCSV = (data, filename = 'dados.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Cabeçalho
    ...data.map(row =>
      headers.map(field =>
        `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`
      ).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DownloadResultsCSV = ({ associations }) => {
  return (
    <button
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
      onClick={() => downloadCSV(associations, 'associacoes.csv')}
    > <FaFileExcel className="inline mr-2" />
      Download CSV
    </button>
  );
};

export default DownloadResultsCSV;
