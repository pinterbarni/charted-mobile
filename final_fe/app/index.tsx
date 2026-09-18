import { ROUTES } from '@/constants/routes.constants';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={ROUTES.LOGIN} />;
}
