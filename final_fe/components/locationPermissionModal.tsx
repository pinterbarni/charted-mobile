import { useAppTheme } from '@/contexts/themeContext';
import { useTranslation } from 'react-i18next';
import ChoiceModal from './choiceModal';

type Props = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function LocationPermissionModal({ onDismiss, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <ChoiceModal
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={t('modals.locationPermission.title')}
      description={t('modals.locationPermission.description')}
      primaryLabel={t('modals.locationPermission.confirm')}
      secondaryLabel={t('modals.locationPermission.cancel')}
      primaryVariant="cta"
      headerBackgroundColor={theme.locationModal.titleBackground}
    />
  );
}
