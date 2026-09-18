import { useTranslation } from 'react-i18next';
import ChoiceModal from './choiceModal';

type Props = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function NotificationPermissionModal({ onDismiss, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <ChoiceModal
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={t('modals.notificationPermission.title')}
      description={t('modals.notificationPermission.description')}
      primaryLabel={t('modals.notificationPermission.confirm')}
      secondaryLabel={t('modals.notificationPermission.cancel')}
    />
  );
}
