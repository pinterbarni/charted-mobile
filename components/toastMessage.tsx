import { CheckmarkIcon } from '@/assets/svgs/checkmarkIcon';
import { WarningTriangleIcon } from '@/assets/svgs/warningTriangleIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { StyleSheet, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastConfigParams } from 'react-native-toast-message';

export type ToastMessageType = 'success' | 'warning' | 'error';

type Props = {
  type: ToastMessageType;
  text1?: string;
};

export default function ToastMessage({ type, text1 }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const toast = theme.toast[type];
  const styles = makeStyles(theme, type, insets);

  const renderIcon = () => {
    switch (type) {
      case 'warning':
      case 'error':
        return <WarningTriangleIcon color={toast.label} size={10} />;
      case 'success':
        return <CheckmarkIcon color={toast.label} size={10} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{renderIcon()}</View>

      <Text style={styles.text}>{text1}</Text>
    </View>
  );
}

export const toastConfig = {
  error: (props: ToastConfigParams<any>) => <ToastMessage {...props} type="error" />,
  warning: (props: ToastConfigParams<any>) => <ToastMessage {...props} type="warning" />,

  success: (props: ToastConfigParams<any>) => <ToastMessage {...props} type="success" />,
};

const makeStyles = (theme: AppTheme, type: ToastMessageType, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.toast[type].background,
      alignItems: 'flex-start',
      padding: 16,
      borderRadius: 4,
      gap: 10,
      marginHorizontal: 16,

      marginTop: insets.top,
      marginBottom: insets.bottom,
    },
    // shadow: {
    //   shadowColor: todo check- shadow on design?
    //   shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.12,
    //   shadowRadius: 8,
    //   elevation: 6,
    // },
    iconWrapper: {
      justifyContent: 'center',
      height: 10,
      marginTop: 4,
    },
    text: {
      ...typography.l2u,
      color: theme.toast[type].label,
      flex: 1,
    },
  });
