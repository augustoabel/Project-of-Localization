// components/MapView.jsx
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import greenMarkerIcon from '../../assets/marker-icon-2x-green.png';
import redMarkerIcon from '../../assets/marker-icon-2x-red.png';
import blueMarkerIcon from '../../assets/marker-icon-2x-blue.png';
import orangeMarkerIcon from '../../assets/marker-icon-2x-orange.png';
import greyMarkerIcon from '../../assets/marker-icon-2x-grey.png';
import markerShadow from '../../assets/marker-shadow.png';

import L from 'leaflet'; // Certifique-se de importar L

function MapView({ associations }) {
  if (!associations.length) return null;

  const center = [
    associations.reduce((sum, r) => sum + r.novoLat, 0) / associations.length,
    associations.reduce((sum, r) => sum + r.novoLng, 0) / associations.length
  ];

  // --- Ícones ---
  const iconSize = [25, 41];
  const shadowSize = [41, 41];
  const baseOptions = {
    shadowUrl: markerShadow,
    iconSize,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize,
  };

  const icons = {
    Boyd: new L.Icon({ ...baseOptions, iconUrl: greenMarkerIcon }),
    Adam: new L.Icon({ ...baseOptions, iconUrl: blueMarkerIcon }),
    Bill: new L.Icon({ ...baseOptions, iconUrl: orangeMarkerIcon }),
    Scott: new L.Icon({ ...baseOptions, iconUrl: greyMarkerIcon }),
    New: new L.Icon({ ...baseOptions, iconUrl: redMarkerIcon }) // default para novos
  };

  const getIconForVendedor = (vendedor) => {
    return icons[vendedor] || icons.New;
  };

  return (
    <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="h-[500px] w-full my-6 rounded-md shadow">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {associations.map((r, idx) => (
        <Polyline
          key={`line-${idx}`}
          positions={[[r.novoLat, r.novoLng], [r.clienteLat, r.clienteLng]]}
          pathOptions={{ color: 'blue' }}
        />
      ))}

      {associations.map((r, idx) => (
        <div key={idx}>
          <Marker
            position={[r.novoLat, r.novoLng]}
            icon={icons.New}
          >
            <Popup>
              <strong>{r.novoNome}</strong><br />
              {r.novoEndereco}
            </Popup>
          </Marker>

          <Marker
            position={[r.clienteLat, r.clienteLng]}
            icon={getIconForVendedor(r.vendedor)}
          >
            <Popup>
              <strong>{r.clienteProximoNome}</strong><br />
              {r.clienteProximoEndereco}
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}

export default MapView;
