import { useTranslation } from 'react-i18next';
import ChoiceModal from './choiceModal';

type Props = {
  onDismiss?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function CannotLeaveAppModal({ onDismiss, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <ChoiceModal
      onDismiss={onDismiss}
      title={t('modals.cannotLeaveApp.title')}
      description={t('modals.cannotLeaveApp.description')}
      primaryLabel={t('modals.cannotLeaveApp.confirm')}
      secondaryLabel={t('modals.cannotLeaveApp.cancel')}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
