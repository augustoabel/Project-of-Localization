import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMap, FaMapMarkedAlt } from 'react-icons/fa';
import { FaChartBar, FaListAlt } from 'react-icons/fa';

//JSON
import Json from "../updated_exhibitors_data.json"
import adamClients from "../../../python/adam/adamCustomerUSA&CAN.json"
import billClients from "../../../python/bill/billCustomerUSA&CAN.json";
import boydClients from "../../../python/boyd/boydCustomerUSA&CAN.json";
import scottClients from "../../../python/scott/scottCustomer.json";

//Components
import haversineDistance from "../utils/haversineDistance.js";
import Header from "../components/Header";
import KpiCard from "../components/KpiCard";
import ChartSection from "../components/ChartSection";
import Filters from "../components/Filters.jsx";
import ExhibitorGrid from "../components/ExhibitorGrid.jsx";
import ExpositorMap from "../components/ExpositorMap.jsx";
import DownloadExcel from '../components/DownloadExcel';
import MapView from "./DistanceBtwCustomerAndSeller/MapView.jsx";
import DownloadResultsCSV from "./DistanceBtwCustomerAndSeller/DownloadResultsCSV.jsx";

const Home = ({ setJsonData }) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [filtered, setFiltered] = useState([]);
    const allExhibitors = Json || [];
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const handleLoadJson = () => {
        setJsonData(results);
        navigate("/results");
    };

    const vendedores = [
        { nome: 'Adam', clientes: adamClients },
        { nome: 'Bill', clientes: billClients },
        { nome: 'Boyd', clientes: boydClients },
        { nome: 'Scott', clientes: scottClients },
    ];

    const categories = Array.from(new Set(allExhibitors.map(ex => ex.categoria || 'Sem Categoria'))).map(catName => ({ nome: catName, link: '#' }));
    useEffect(() => {
        let result = allExhibitors;

        if (category !== "all") {
            result = result.filter(ex => ex.categoria === category);
        }

        if (search.trim()) {
            result = result.filter(ex =>
                [ex.nome, ...(ex.endereco || []), ex.telefone, ex.categoria]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        setFiltered(result);
    }, [search, category, allExhibitors]);

    useEffect(() => {
        const processar = () => {
            const lista = [];
            for (const novo of Json) {
                let menorDistancia = Infinity;
                let vendedorMaisProximo = null;
                let clienteMaisProximo = null;

                for (const vendedor of vendedores) {
                    for (const cliente of vendedor.clientes) {
                        const d = haversineDistance(
                            novo.lat,
                            novo.lng,
                            cliente.lat,
                            cliente.lng
                        );
                        if (d < menorDistancia) {
                            menorDistancia = d;
                            vendedorMaisProximo = vendedor.nome;
                            clienteMaisProximo = cliente;
                        }
                    }
                }

                lista.push({
                    novoNome: novo.Company,
                    novoEndereco: novo.Address.join(', '),
                    vendedor: vendedorMaisProximo,
                    clienteProximoNome: clienteMaisProximo.Company,
                    clienteProximoEndereco: `${clienteMaisProximo.Address}, ${clienteMaisProximo.City}, ${clienteMaisProximo.Province}, ${clienteMaisProximo.Country}, ${clienteMaisProximo["Postal Code"]}`,
                    distancia: menorDistancia.toFixed(2),
                    novoLat: novo.lat,
                    novoLng: novo.lng,
                    clienteLat: clienteMaisProximo.lat,
                    clienteLng: clienteMaisProximo.lng
                });
            }
            setResults(lista);
        };
        processar();
    }, []);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Header />
            <div className="flex justify-end items-center mb-6">
                <DownloadExcel data={allExhibitors} fileName="expositores_data" />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <KpiCard label="All Categories" value={categories.length} />
                <KpiCard label="Possible Customer" value={allExhibitors.length} />
            </div>
            <ExpositorMap />
            <div className="pt-4 pb-2 px-4 bg-white shadow rounded-lg mb-6 ">
                <div className="flex justify-end">
                    <button className="me-5 bg-yellow-500 p-2 px-5 rounded-lg text-white font-semibold flex " onClick={handleLoadJson}>
                        <FaChartBar className="text-xl me-2" /> Results
                    </button>
                    <DownloadResultsCSV associations={results} />
                </div>
                <MapView associations={results} />
            </div>
            <ChartSection allExhibitors={allExhibitors} categories={categories} />
            <Filters
                categories={categories}
                setCategory={setCategory}
                search={search}
                setSearch={setSearch}
            />
            <ExhibitorGrid exhibitors={filtered} />
        </div>
    );
};
export default Home;