import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { Trail } from '@/types/trail.types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import TrailListItem from './trailListItem';

type Props = {
  title: string;
  trails: Trail[];
  onTrailPress?: (trail: Trail) => void;
  onEndItemPress?: () => void;
};

export default function TrailList({ title, trails, onTrailPress, onEndItemPress }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {trails.map((trail) => (
          <TrailListItem
            key={trail.id}
            trail={trail}
            label={trail.title}
            onPress={() => onTrailPress?.(trail)}
          />
        ))}
        {onEndItemPress && <TrailListItem isEndItem label="" onPress={onEndItemPress} />}
      </ScrollView>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
    },
    title: {
      ...typography.h3,
      color: theme.defaultTitle,
      paddingBottom: 24,
      paddingLeft: 16,
    },
    emptyText: {
      ...typography.p1r,
      color: theme.delicateBorder,
    },
    listEnd: {
      paddingRight: 16,
    },
    list: {
      gap: 16,
      paddingHorizontal: 16,
    },
  });
