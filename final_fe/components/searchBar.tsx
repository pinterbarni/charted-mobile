import { MagnifyingGlassIcon } from '@/assets/svgs/magnifyingGlassIcon';
import { XIcon } from '@/assets/svgs/xIcon';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { todo } from '@/utils/todo.utils';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  value: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText = todo('onChangeText'),
  onClear = todo('onClear'),
  placeholder = '{placeholder}',
}: Props) {
  const theme = useAppTheme();
  const hasValue = value.length > 0;
  const styles = makeStyles(theme, hasValue);

  return (
    <View style={styles.container}>
      {!hasValue && (
        <View style={styles.placeholderIcon} pointerEvents="none">
          <MagnifyingGlassIcon size={16} color={theme.searchBar.icon} />
        </View>
      )}
      <TextInput
        placeholderTextColor={theme.searchBar.placeholder}
        numberOfLines={1}
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        textAlignVertical="center"
      />

      {hasValue && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <XIcon size={16} color={theme.searchBar.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const makeStyles = (theme: AppTheme, hasValue: boolean) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.searchBar.border,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.searchBar.background,

      paddingLeft: 15,
      overflow: 'hidden',
    },
    input: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 14,
      paddingLeft: hasValue ? 0 : 28,
      color: theme.searchBar.text,
      paddingVertical: 15,
      includeFontPadding: false,
      flex: 1,
      textAlignVertical: 'center',
      paddingRight: 15,
    },
    clearButton: {
      padding: 13,
    },
    placeholderIcon: {
      position: 'absolute',
      left: 15,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
