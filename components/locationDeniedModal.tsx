import { useAppTheme } from '@/contexts/themeContext';
import { useTranslation } from 'react-i18next';
import ChoiceModal from './choiceModal';

type Props = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function LocationDeniedModal({ onDismiss, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <ChoiceModal
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={t('modals.locationDenied.title')}
      description={t('modals.locationDenied.description')}
      primaryLabel={t('modals.locationDenied.confirm')}
      secondaryLabel={t('modals.locationDenied.cancel')}
      primaryVariant="cta"
      headerBackgroundColor={theme.locationModal.titleBackground}
    />
  );
}
