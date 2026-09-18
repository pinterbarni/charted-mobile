import TagPill from '@/components/tagPill';
import {
  COMPASS_ABBREVIATIONS,
  COMPASS_DIRECTIONS,
  CompassDirection,
  POI_CATEGORY_ICONS,
  Poi,
} from '@/types/poi.types';
import { ViewAnnotation } from '@maplibre/maplibre-react-native';

type Props = {
  pois: Poi[];
};

export default function PoiMapAnnotations({ pois }: Props) {
  return (
    <>
      {pois.map((poi) => {
        const isCompass = COMPASS_DIRECTIONS.includes(poi.category as CompassDirection);
        const Icon = POI_CATEGORY_ICONS[poi.category];
        const direction = poi.category as CompassDirection;

        return (
          <ViewAnnotation key={poi.id} lngLat={[poi.lon, poi.lat]} anchor="center">
            {isCompass ? (
              <TagPill label={COMPASS_ABBREVIATIONS[direction]} minWidth={32} />
            ) : (
              <Icon size={22} />
            )}
          </ViewAnnotation>
        );
      })}
    </>
  );
}
