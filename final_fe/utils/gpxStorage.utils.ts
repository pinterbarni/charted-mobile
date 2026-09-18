import { Poi, PoiCategory } from '@/types/poi.types';
import { Directory, File, Paths } from 'expo-file-system';
import { XMLParser } from 'fast-xml-parser';

const getChartedDirectory = () => new Directory(Paths.document.uri + 'charted/routes/');

export const ensureChartedDirectory = async (): Promise<void> => {
  try {
    getChartedDirectory().create();
  } catch {}
};

export type ParsedGpx = {
  pois: Poi[];
};

export const buildGpx = (name: string, coordinates: [number, number][], pois?: Poi[]): string => {
  const trkpts = coordinates.map(([lon, lat]) => `    <trkpt lat="${lat}" lon="${lon}"></trkpt>`).join('\n');

  const wpts = pois
    ? pois.map((p) => `  <wpt lat="${p.lat}" lon="${p.lon}"><name>${p.category}</name></wpt>`).join('\n')
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Charted">
${wpts}
  <trk>
    <name>${name}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  console.log('[buildGpx] output preview:', xml.slice(0, 200));

  return xml;
}; // find a way to define it in an other way

export const savePlannedRouteAsGpx = async (
  coordinates: [number, number][],
  name: string,
  pois?: Poi[]
): Promise<string> => {
  const chartedDir = new Directory(Paths.document.uri + 'charted/');
  const routesDir = new Directory(Paths.document.uri + 'charted/routes/');

  try {
    chartedDir.create();
  } catch {}
  try {
    routesDir.create();
  } catch {}

  const fileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.gpx`;
  console.log('GPX saving:', fileName, '&&&&& coords:', coordinates.length, '&&&&& pois:', pois?.length ?? 0);
  const file = new File(routesDir.uri + fileName);
  file.write(buildGpx(name, coordinates, pois));
  return file.uri;
};

export const listSavedRoutes = async (): Promise<{ name: string; path: string }[]> => {
  try {
    getChartedDirectory().create();
  } catch {}
  const files = getChartedDirectory().list();
  console.log(
    ' FF FOUND these files:',
    files.map((f) => (f as File).name)
  );
  return files
    .filter((f) => f instanceof File && f.name.endsWith('.gpx'))
    .map((f) => ({
      name: (f as File).name.replace(/_\d+\.gpx$/, '').replace(/_/g, ' '),
      path: (f as File).uri,
    }))
    .reverse();
};

export const readGpxFile = async (path: string): Promise<string> => {
  return new File(path).text();
};

export const deleteGpxFile = async (path: string): Promise<void> => {
  const file = new File(path);
  try {
    file.delete();
    console.log('deleteGpx deleting:', path);
  } catch {
    // file doesn't exist
    console.warn('deleteGpx !!! file not found:', path);
  }
};

export const parseGpxFile = async (path: string): Promise<ParsedGpx> => {
  const content = await readGpxFile(path);
  console.log('parseGpx raw content length:', content.length);
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const parsed = parser.parse(content);

  const wpts = parsed?.gpx?.wpt ?? [];
  const wptArray = Array.isArray(wpts) ? wpts : [wpts];

  const pois: Poi[] = wptArray
    .filter((w: any) => w['@_lat'] && w['@_lon'])
    .map((w: any, i: number) => ({
      id: String(i),
      lat: parseFloat(w['@_lat']),
      lon: parseFloat(w['@_lon']),
      category: (w.name ?? 'default') as PoiCategory,
    }));

  console.log('parseGpx:: wpts raw:', JSON.stringify(wpts));
  console.log('parseGpx:: parsed pois:', pois);
  return { pois };
};
