import Svg, { Path } from 'react-native-svg';

type PoiIconBaseProps = {
  background: string;
  border: string;
  children?: React.ReactNode;
};

export function PoiIconBase({ background, border, children }: PoiIconBaseProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4 0.5H18C19.933 0.5 21.5 2.067 21.5 4V18C21.5 19.933 19.933 21.5 18 21.5H4C2.067 21.5 0.5 19.933 0.5 18V4C0.5 2.067 2.067 0.5 4 0.5Z"
        fill={background}
      />
      <Path
        d="M4 0.5H18C19.933 0.5 21.5 2.067 21.5 4V18C21.5 19.933 19.933 21.5 18 21.5H4C2.067 21.5 0.5 19.933 0.5 18V4C0.5 2.067 2.067 0.5 4 0.5Z"
        stroke={border}
      />
      {children}
    </Svg>
  );
}
