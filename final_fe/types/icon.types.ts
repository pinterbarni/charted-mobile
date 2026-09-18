export type AppIconProps = {
  color?: string;
  size?: number;
};

export type AppIconProp = {
  size?: number;
};

export type AppIcon = AppIconProp | AppIconProps;

export type PoiIconProps = {
  background?: string;
  border?: string;
  center?: string;
  size?: number;
};

export const ICON_DEFAULTS = {
  size: 16,
} as const;
