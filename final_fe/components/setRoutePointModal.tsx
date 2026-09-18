import { CurrentLocationIcon } from '@/assets/svgs/currentLocationIcon';
import { PinIcon } from '@/assets/svgs/pinIcon';
import { todo } from '@/utils/todo.utils';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  onDismiss?: () => void;
  onUseCurrentLocationPress?: () => void;
  onSetPinManuallyPress?: () => void;
};

export default function SetRoutePointModal({
  onDismiss = todo('onDismiss'),
  onUseCurrentLocationPress = todo('onUseCurrentLocationPress'),
  onSetPinManuallyPress = todo('onSetPinManuallyPress'),
}: Props) {
  const groups: ModalItemGroup[] = [
    [
      { title: 'Use Current Location', icon: CurrentLocationIcon, onPress: onUseCurrentLocationPress },
      { title: 'Set Pin Manually', icon: PinIcon, onPress: onSetPinManuallyPress },
    ],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
