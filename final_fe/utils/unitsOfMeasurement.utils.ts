export type UnitOfMeasurementSystem = 'metric' | 'imperial';

const toNativeLocale = (locale: string) => (locale === 'hu' ? 'hu-HU' : 'en-US');

const formatDecimal = (value: number, decimals: number, locale: string): string =>
  value.toLocaleString(toNativeLocale(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const kmToMilesConversionFactor = 0.621371;
const mToFeetConversionFactor = 3.28084;
const secondsInHour = 3600;
const secondsInMinute = 60;

export const formatDistance = (
  km: number,

  unit: UnitOfMeasurementSystem,
  locale: string = 'en',
  decimals: number = 2,

  noSpace: boolean = false
): string => {
  const value = unit === 'imperial' ? km * kmToMilesConversionFactor : km;
  const sep = noSpace ? '' : ' ';
  return formatDecimal(value, decimals, locale) + sep + (unit === 'imperial' ? 'mi' : 'km');
};

export const formatElevation = (
  m: number,
  unit: UnitOfMeasurementSystem,
  locale: string = 'en',
  noSpace: boolean = false
): string => {
  const value = unit === 'imperial' ? Math.round(m * mToFeetConversionFactor) : Math.round(m);
  const sep = noSpace ? '' : ' ';
  return value + sep + (unit === 'imperial' ? 'ft' : 'm');
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor((seconds % secondsInHour) / secondsInMinute);
  const h = Math.floor(seconds / secondsInHour);
  const s = seconds % secondsInMinute;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatPace = (kmh: number, unit: UnitOfMeasurementSystem, locale: string = 'en'): string => {
  const value = unit === 'imperial' ? kmh * kmToMilesConversionFactor : kmh;
  return formatDecimal(value, 2, locale) + (unit === 'imperial' ? ' mph' : ' km/h');
};
