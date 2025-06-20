import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Import both JSON files
import newClientsData from "../../../Merge JSON/updated_exhibitors_data.json"; // Your newly geocoded data (New Clients)
import oldClientsDataBoyd from "../../../python/boyd/boydCustomerUSA&CAN.json"; // Your existing data (Old Clients)
import oldClientsDataAdam from "../../../python/adam/adamCustomerUSA&CAN.json"; // Your existing data (Old Clients)
import oldClientsDataBill from "../../../python/bill/billCustomerUSA&CAN.json"; // Your existing data (Old Clients)
import oldClientsDataScott from "../../../python/scott/scottCustomer.json"; // Your existing data (Old Clients)

// Importe as imagens locais
import greenMarkerIcon from '../assets/marker-icon-2x-green.png';
import redMarkerIcon from '../assets/marker-icon-2x-red.png';
import blueMarkerIcon from '../assets/marker-icon-2x-blue.png';
import orangeMarkerIcon from '../assets/marker-icon-2x-orange.png';
import greyMarkerIcon from '../assets/marker-icon-2x-grey.png';
import markerShadow from '../assets/marker-shadow.png'; // A sombra é a mesma para todos


// --- Custom Icon Definitions ---
//New Clients
const newClientIcon = new L.Icon({
    iconUrl: redMarkerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// BOYD
const oldClientIcon = new L.Icon({
    iconUrl: greenMarkerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// ADAM
const blueIcon = new L.Icon({
    iconUrl: blueMarkerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// BILL
const orangeIcon = new L.Icon({
    iconUrl: orangeMarkerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// SCOTT
const greyIcon = new L.Icon({
    iconUrl: greyMarkerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



const ExpositorMap = () => {
    const [allExpositores, setAllExpositores] = useState([]);

    useEffect(() => {
        const processedNewClients = newClientsData
            .filter(e => e.lat && e.lng)
            .map(client => ({
                ...client,
                type: 'new', // Exemplo: Clientes 'new' são vermelhos
                displayName: client.Company,
                displayAddress: [client["Address 1"], client.City, client.Province, client["Postal Code"], client.Country].filter(Boolean).join(', ')
            }));

        const processedOldClientsBoyd = oldClientsDataBoyd
            .filter(e => e.lat && e.lng)
            .map(client => ({
                ...client,
                type: 'boyd', // Exemplo: Clientes 'old' são verdes
                displayName: client.nome,
                displayAddress: Array.isArray(client.endereco) ? client.endereco.join(', ') : client.endereco
            }));

        const processedOldClientsAdam = oldClientsDataAdam
            .filter(e => e.lat && e.lng)
            .map(client => ({
                ...client,
                type: 'adam', // Exemplo: Clientes 'old' são verdes
                displayName: client.nome,
                displayAddress: Array.isArray(client.endereco) ? client.endereco.join(', ') : client.endereco
            }));

        const processedOldClientsBill = oldClientsDataBill
            .filter(e => e.lat && e.lng)
            .map(client => ({
                ...client,
                type: 'bill', // Exemplo: Clientes 'old' são verdes
                displayName: client.nome,
                displayAddress: Array.isArray(client.endereco) ? client.endereco.join(', ') : client.endereco
            }));

        const processedOldClientsScott = oldClientsDataScott
            .filter(e => e.lat && e.lng)
            .map(client => ({
                ...client,
                type: 'scott', // Exemplo: Clientes 'old' são verdes
                displayName: client.nome,
                displayAddress: Array.isArray(client.endereco) ? client.endereco.join(', ') : client.endereco
            }));

    
        setAllExpositores([
            ...processedNewClients,
            ...processedOldClientsBoyd,
            ...processedOldClientsAdam,
            ...processedOldClientsBill,
            ...processedOldClientsScott,
        ]);

        console.log("Combined Map Data:", allExpositores);

    }, [newClientsData, oldClientsDataBoyd]); // Adicione outras dependências de dados aqui se tiver

    const calculateCenter = () => {
        if (allExpositores.length === 0) {
            return [44.63705596820978, -97.51030955584403]; // Default center (e.g., USA)
        }

        let latSum = 0;
        let lngSum = 0;
        allExpositores.forEach(ex => {
            latSum += ex.lat;
            lngSum += ex.lng;
        });

        return [latSum / allExpositores.length, lngSum / allExpositores.length];
    };

    const mapCenter = calculateCenter();

    return (
        <>
            <div className='w-full mt-10 bg-white rounded-lg shadow-2xl p-4 flex'>
                <div className='flex font-semibold me-10'><div className='me-2 mb-2 h-5 w-5 rounded bg-red-600'></div>Possible New Customer</div>
                <div className='flex font-semibold me-10'><div className='me-2 mb-2 h-5 w-5 rounded bg-green-600'></div>Old Customer - Boyd</div>
                <div className='flex font-semibold me-10'><div className='me-2 mb-2 h-5 w-5 rounded bg-blue-600'></div>Old Customer - Adam</div>
                <div className='flex font-semibold me-10'><div className='me-2 mb-2 h-5 w-5 rounded bg-orange-600'></div>Old Customer - Bill</div>
                <div className='flex font-semibold me-10'><div className='me-2 mb-2 h-5 w-5 rounded bg-gray-600'></div>Old Customer - Scott</div>
            </div>
            <div className="h-[600px] w-full mt-2 mb-10 bg-white rounded-lg shadow-2xl p-4">
                <MapContainer center={mapCenter} zoom={4} scrollWheelZoom className="h-full w-full">
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {allExpositores.map((ex, idx) => {
                        let markerIcon;
                        switch (ex.type) {
                            case 'new':
                                markerIcon = newClientIcon;
                                break;
                            case 'boyd':
                                markerIcon = oldClientIcon;
                                break;
                            case 'adam': // Usando os tipos que adicionei no demoData
                                markerIcon = blueIcon;
                                break;
                            case 'bill':
                                markerIcon = orangeIcon;
                                break;
                            case 'scott':
                                markerIcon = greyIcon;
                                break;
                            default:
                                markerIcon = oldClientIcon; // Ícone padrão caso o tipo não seja reconhecido
                        }

                        return (
                            <Marker
                                key={idx}
                                position={[ex.lat, ex.lng]}
                                icon={markerIcon} // Usa o ícone determinado pelo switch
                            >
                                <Popup>
                                    <strong>{ex.Company}</strong><br />
                                    {ex.Address} {ex.City} <br />
                                    {ex.Phone && <span>Phone: {ex.Phone}</span>}<br />
                                    {ex.site && <a href={ex.site} target="_blank" rel="noopener noreferrer" className='underline'>Website</a>}<br />
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </>
    );
}

export default ExpositorMap;