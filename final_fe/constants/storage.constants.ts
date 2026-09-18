export const SECURE_STORAGE_KEYS = {
  NOTIFICATION_PERMISSION_DISMISSED: 'notification_permission_dismissed',
  NOTIFICATION_PERMISSION_ASK_COUNT: 'notification_permission_ask_count',
  APP_BOOT_COUNT: 'app_boot_count',
  PERMISSION_QUEUE_COMPLETED: 'permission_queue_completed',
  LOCATION_PERMISSION_ASK_BOOT: 'location_permission_ask_boot',
  LOCATION_PERMANENTLY_DENIED: 'location_permanently_denied',
} as const;

export const LOCAL_STORAGE_KEYS = {
  PENDING_HIKES: 'pending_hikes',
  CACHED_PROFILE: 'cached_profile',
} as const;
