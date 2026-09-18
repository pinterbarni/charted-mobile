import Pill from '@/components/pill';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { ScrollView, StyleSheet } from 'react-native';

type PillItem = {
  label: string;
  onPress: () => void;
  isActive?: boolean;
};

type Props = {
  items: PillItem[];
};

export default function PillRow({ items }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {items.map((item, index) => (
        <Pill key={index} label={item.label} isActive={item.isActive} onPress={item.onPress} />
      ))}
    </ScrollView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 16,
      paddingBottom: 14,
      paddingTop: 24,
      paddingHorizontal: 16,
      backgroundColor: theme.header.background,
    },
  });
