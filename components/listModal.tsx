import { LikeIcon } from '@/assets/svgs/likeIcon';
import { ShareIcon } from '@/assets/svgs/shareIcon';
import { UserIcon } from '@/assets/svgs/userIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { AppIconProps } from '@/types/icon.types';
import { todo } from '@/utils/todo.utils';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Backdrop from './backdrop';

export type ModalItem = {
  title?: string;
  onPress?: () => void;
  isDangerous?: boolean;

  icon?: React.ComponentType<AppIconProps>;
};

// todo- separate into types class and components!
export type ModalItemGroup = ModalItem[];

type Props = {
  groups?: ModalItemGroup[];
  scrollable?: boolean;

  onDismiss?: () => void;
  footer?: React.ReactNode;
};

const DEFAULT_GROUPS: ModalItemGroup[] = [
  [
    { title: '{option 1}', icon: UserIcon, onPress: todo('groups') },
    { title: '{opt 2}', icon: LikeIcon, onPress: todo('groups') },
  ],
  [{ title: '{opt 3}', icon: ShareIcon, onPress: todo('groups'), isDangerous: true }],
];

//todo: fix brd artifact, move const/
export default function ListModal({
  onDismiss = todo('onDismiss'),
  groups = DEFAULT_GROUPS,
  scrollable = false,
  footer,
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const ModalItemDivider = ({ styles }: { styles: ReturnType<typeof makeStyles> }) => (
    <View style={styles.divider} />
  );

  const ModalItemRow = ({
    item,
    isLast,
    styles,
    theme,
  }: {
    item: ModalItem;
    isLast: boolean;
    styles: ReturnType<typeof makeStyles>;
    theme: AppTheme;
  }) => {
    const Icon = item.icon;
    return (
      <View>
        <TouchableOpacity style={styles.item} onPress={item.onPress}>
          {Icon && (
            <Icon
              color={item.isDangerous ? theme.listModal.dangerZone : theme.listModal.item.icon}
              size={16}
            />
          )}

          <Text style={[styles.itemText, item.isDangerous && styles.itemTextDangerous]}>{item.title}</Text>
        </TouchableOpacity>
        {!isLast && <ModalItemDivider styles={styles} />}
      </View>
    );
  };

  const content = (
    <View style={styles.container}>
      {groups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.group}>
          {group.map((item, itemIndex) => (
            <ModalItemRow
              item={item}
              isLast={itemIndex === group.length - 1}
              styles={styles}
              theme={theme}
              key={itemIndex}
            />
          ))}
        </View>
      ))}

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onDismiss} statusBarTranslucent>
      <Backdrop onDismiss={onDismiss}>
        {scrollable ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </Backdrop>
    </Modal>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    group: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.listModal.item.border,
      overflow: 'hidden',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 10,
      backgroundColor: theme.listModal.item.background,
    },
    itemText: {
      ...typography.l1m,
      color: theme.listModal.item.text,
    },
    itemTextDangerous: {
      color: theme.listModal.dangerZone,
    },
    itemTrailing: {
      marginLeft: 16,
    },
    itemDisabled: {
      opacity: 0.4,
    },
    divider: {
      height: 1,
      backgroundColor: theme.listModal.item.border,
    },
    itemPressed: {
      backgroundColor: theme.listModal.item.border,
    },
    scrollContent: {
      flexGrow: 1,
    },
    iconWrapper: {
      width: 20,
      alignItems: 'center',
    },

    footer: {
      gap: 8,
    },
  });
