import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResultsTable from './pages/DistanceBtwCustomerAndSeller/ResultsTable.jsx'; // ajuste o caminho conforme necessário
import Home from './pages/Home.jsx'; // exemplo de outra página
import Json from "./updated_exhibitors_data.json"
import Header from "./components/Header";
import KpiCard from "./components/KpiCard";
import ChartSection from "./components/ChartSection";
import Filters from "./components/Filters.jsx";
import ExhibitorGrid from "./components/ExhibitorGrid.jsx";
import ExpositorMap from "./components/ExpositorMap.jsx";
import DownloadExcel from './components/DownloadExcel'; // Importa o novo componente
import MapView from "./pages/DistanceBtwCustomerAndSeller/MapView.jsx";



function App() {
  const [jsonData, setJsonData] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setJsonData={setJsonData} />} />
        <Route path="/results" element={<ResultsTable data={jsonData} />} />
        <Route path="/maps" element={<MapView associations={jsonData} />} />
      </Routes>
    </Router>
  );
}

export default App;

// const App = () => {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("all");
//   const [filtered, setFiltered] = useState([]);

//   // Assuming 'Json' now directly holds the array of exhibitors
//   // And each exhibitor object already has a 'categoria' property
//   const allExhibitors = Json || []; // Use 'Json' directly; add a fallback to empty array

//   // To get unique categories for the filter, we'll derive them from allExhibitors
//   const categories = Array.from(new Set(allExhibitors.map(ex => ex.categoria || 'Sem Categoria')))
//     .map(catName => ({ nome: catName, link: '#' })); // Create a simple object for consistency with old 'categories' structure if needed by Filters component

//   useEffect(() => {
//     let result = allExhibitors;

//     if (category !== "all") {
//       result = result.filter(ex => ex.categoria === category); // Use 'ex.categoria'
//     }

//     if (search.trim()) {
//       result = result.filter(ex =>
//         [ex.nome, ...(ex.endereco || []), ex.telefone, ex.categoria] // Added ex.categoria to search
//           .filter(Boolean) // Filter out null/undefined/empty strings for cleaner join
//           .join(" ")
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       );
//     }

//     setFiltered(result);
//   }, [search, category, allExhibitors]); // Add allExhibitors to dependencies if it can change

//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <Header />
//       <div className="flex justify-end items-center mb-6">
//         <DownloadExcel data={allExhibitors} fileName="expositores_data" /> {/* Passa os dados e nome do arquivo */}
//       </div>
//       {/* KpiCard components for total categories and exhibitors */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* If categories are derived, KpiCard should reflect unique derived categories */}
//         <KpiCard label="All Categories" value={categories.length} />
//         <KpiCard label="Possible Customer" value={allExhibitors.length} />
//       </div>
//       <ExpositorMap />
//       {/* Pass the derived categories to ChartSection and Filters */}
//       <ChartSection allExhibitors={allExhibitors} categories={categories} />
//       <Filters
//         categories={categories} // Now correctly derived from the flattened data
//         setCategory={setCategory}
//         search={search}
//         setSearch={setSearch}
//       />
//       <ExhibitorGrid exhibitors={filtered} />
//     </div>
//   );
// };

// export default App;