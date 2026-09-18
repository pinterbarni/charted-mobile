import { EditProfileIcon } from '@/assets/svgs/editProfileIcon';
import { LockIcon } from '@/assets/svgs/lockIcon';
import { todo } from '@/utils/todo.utils';
import { useTranslation } from 'react-i18next';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  onEditBioPress?: () => void;
  onDismiss?: () => void;
  onEditNamePress?: () => void;
  onLogoutPress?: () => void;
};

export default function EditOrLogoutModal({
  onEditNamePress = todo('onEditNamePress'),
  onEditBioPress = todo('onEditBioPress'),
  onLogoutPress = todo('onLogoutPress'),
  //backdrop:
  onDismiss = todo('onDismiss'),
}: Props) {
  const { t } = useTranslation();

  // stays here?
  const groups: ModalItemGroup[] = [
    [
      { title: t('profile.editName'), icon: EditProfileIcon, onPress: onEditNamePress },
      { title: t('profile.editBio'), icon: EditProfileIcon, onPress: onEditBioPress },
    ],
    [{ title: t('profile.logout'), icon: LockIcon, onPress: onLogoutPress, isDangerous: true }],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
