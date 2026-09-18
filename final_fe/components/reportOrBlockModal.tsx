import { BlockIcon } from '@/assets/svgs/blockIcon';
import { ExclamationIcon } from '@/assets/svgs/exclamationIcon';
import { todo } from '@/utils/todo.utils';
import { useTranslation } from 'react-i18next';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  onDismiss?: () => void;
  visible?: boolean;
  onReportPress?: () => void;
  onBlockPress?: () => void;
};

export default function ReportOrBlockModal({
  onDismiss = todo('onDismiss'),
  onReportPress = todo('onReportPress'),
  onBlockPress = todo('onBlockPress'),
  visible,
}: Props) {
  const { t } = useTranslation();
  if (!visible) return null;

  const groups: ModalItemGroup[] = [
    [
      { title: t('social.reportTitle'), icon: ExclamationIcon, onPress: onReportPress, isDangerous: true },
      { title: t('social.blockTitle'), icon: BlockIcon, onPress: onBlockPress, isDangerous: true },
    ],
  ];

  return <ListModal onDismiss={onDismiss} groups={groups} />;
}
