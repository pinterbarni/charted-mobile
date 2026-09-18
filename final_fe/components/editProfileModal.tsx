import { EditProfileIcon } from '@/assets/svgs/editProfileIcon';
import { LockIcon } from '@/assets/svgs/lockIcon';
import { TrashBinIcon } from '@/assets/svgs/trashBinIcon';
import { todo } from '@/utils/todo.utils';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  onDismiss?: () => void;
  onEditProfilePress?: () => void;
  onSecurityPress?: () => void;
  onDeleteAccountPress?: () => void;
};

export default function EditProfileModal({
  onDismiss = todo('onDismiss'),
  onEditProfilePress = todo('onEditProfilePress'),
  onSecurityPress = todo('onSecurityPress'),
  onDeleteAccountPress = todo('onDeleteAccountPress'),
}: Props) {
  const groups: ModalItemGroup[] = [
    [
      { title: 'Edit Profile Details', icon: EditProfileIcon, onPress: onEditProfilePress },
      { title: 'Password & Security', icon: LockIcon, onPress: onSecurityPress },
    ],
    [{ title: 'Delete Account', icon: TrashBinIcon, onPress: onDeleteAccountPress, isDangerous: true }],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
