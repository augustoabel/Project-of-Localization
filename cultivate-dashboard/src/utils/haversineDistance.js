// Função que calcula distância Haversine entre dois pontos (em km)
function haversineDistance(lat1Deg, lon1Deg, lat2Deg, lon2Deg) {
  const toRad = deg => (deg * Math.PI) / 180;
  const lat1 = toRad(lat1Deg), lon1 = toRad(lon1Deg);
  const lat2 = toRad(lat2Deg), lon2 = toRad(lon2Deg);
  const R = 6371; // Raio médio da Terra em km
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
}

export default haversineDistance;

