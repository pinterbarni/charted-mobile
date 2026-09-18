import { EditProfileIcon } from '@/assets/svgs/editProfileIcon';
import { LockIcon } from '@/assets/svgs/lockIcon';
import { TrashBinIcon } from '@/assets/svgs/trashBinIcon';
import { useTranslation } from 'react-i18next';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onEditProfile: () => void;
  onPasswordAndSecurity: () => void;
  onDeleteAccount: () => void;
};

export default function ProfileSettingsModal({
  visible,
  onDismiss,
  onEditProfile,
  onPasswordAndSecurity,
  onDeleteAccount,
}: Props) {
  const { t } = useTranslation();

  if (!visible) return null;

  const groups: ModalItemGroup[] = [
    [
      {
        title: t('profile.editProfile'),
        icon: EditProfileIcon,
        onPress: () => {
          onEditProfile();
          onDismiss();
        },
      },
      {
        title: t('profile.passwordAndSecurity'),
        icon: LockIcon,
        onPress: () => {
          onPasswordAndSecurity();
          onDismiss();
        },
      },
    ],
    [
      {
        title: t('profile.deleteAccount'),
        icon: TrashBinIcon,
        onPress: () => {
          onDeleteAccount();
          onDismiss();
        },
        isDangerous: true,
      },
    ],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
