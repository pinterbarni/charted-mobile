import { useTranslation } from 'react-i18next';
import ChoiceModal from './choiceModal';

type Props = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function BackgroundLocationModal({ onDismiss, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <ChoiceModal
      onDismiss={onDismiss}
      title={t('modals.backgroundLocation.title')}
      description={t('modals.backgroundLocation.description')}
      primaryLabel={t('modals.backgroundLocation.confirm')}
      secondaryLabel={t('modals.backgroundLocation.cancel')}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
