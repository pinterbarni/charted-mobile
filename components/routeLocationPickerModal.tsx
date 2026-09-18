import { PinIcon } from '@/assets/svgs/pinIcon';
import { CurrentLocationRouteIcon } from '@/assets/svgs/routes';
import { useTranslation } from 'react-i18next';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onUseCurrentLocation: () => void;
  onSetPinManually: () => void;
};

export default function RouteLocationPickerModal({
  visible,
  onDismiss,
  onUseCurrentLocation,
  onSetPinManually,
}: Props) {
  const { t } = useTranslation();

  if (!visible) return null;

  const groups: ModalItemGroup[] = [
    [
      {
        title: t('route.useCurrentLocation'),
        icon: CurrentLocationRouteIcon,
        onPress: () => {
          onUseCurrentLocation();
          onDismiss();
        },
      },
      {
        title: t('route.setPinManually'),
        icon: PinIcon,
        onPress: () => {
          onSetPinManually();
          onDismiss();
        },
      },
    ],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
