const BASE_URL = "https://api.aladhan.com/v1";

const MAKKAH_LAT = 21.4225;
const MAKKAH_LNG = 39.8262;

export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number;
  distanceKm: number;
}

function calculateQibla(lat: number, lng: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lat2 = (MAKKAH_LAT * Math.PI) / 180;
  const dLng = ((MAKKAH_LNG - lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function calculateDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((MAKKAH_LAT - lat) * Math.PI) / 180;
  const dLon = ((MAKKAH_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((MAKKAH_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const QiblaService = {
  async getQibla(lat: number, lng: number): Promise<QiblaData> {
    let direction: number;
    try {
      const res = await fetch(`${BASE_URL}/qibla/${lat}/${lng}`);
      if (res.ok) {
        const data = await res.json();
        direction = data.data.direction;
      } else {
        direction = calculateQibla(lat, lng);
      }
    } catch {
      direction = calculateQibla(lat, lng);
    }
    return {
      latitude: lat,
      longitude: lng,
      direction,
      distanceKm: calculateDistance(lat, lng),
    };
  },

  calculateQibla,
  calculateDistance,
};
