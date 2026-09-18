import { apiClient } from '@/utils/apiClient.utils';
import polyline from '@mapbox/polyline';

export const getRoute = async (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number }
): Promise<[number, number][]> => {
  const body = {
    locations: [
      { lat: start.lat, lon: start.lon, type: 'break' },
      { lat: end.lat, lon: end.lon, type: 'break' },
    ],
    costing: 'pedestrian', // always pedestrian, as I said in bff docs! should be const?
    directions_options: { units: 'kilometers' },
  };

  const response = await apiClient.post('/routing/route', body);
  const encoded = response.trip.legs[0].shape;
  const decoded = polyline.decode(encoded, 6);
  //map libre expects lot lan!
  return decoded.map(([lat, lon]) => [lon, lat]);
};
