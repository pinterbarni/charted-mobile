/** Light color schemes for expo-system-ui */
export const CHARTED_COLOR_PALETTE = {
  fullGreen: {
    50: '#42FF00',
    100: '#30CC00',
    200: '#8FAF84',
    300: '#286912',
    400: '#2F4229',
    '300-30pc': 'rgba(40,105,18,0.3)',
    '400-40pc': 'rgba(9,31,1,0.4)',
  },
  neutralGreen: {
    50: '#FCFDFC',
    100: '#EBEFEA',
    200: '#E1E8DF', // end
    300: '#CBD9C7', // start
    400: '#97A494',
    500: '#889485',
    600: '#5C6959',
    700: '#424C3F',
    800: '#091F01',
    '300-85pc': 'rgba(203,217,199,0.85)',
    '400-25pc': 'rgba(92,105,89,0.25)',
  },
  neutral: {
    50: '#FFFFFF',
    100: '#F4F5F4',
    200: '#B5BCB3',
    300: '#525A50',
    400: '#000000',
  },
  citrus: {
    50: '#F2F642',
    100: '#FFD700',
    200: '#FFA500',
    300: '#FF8A00',
    '200-40pc': 'rgba(255,165,0,0.4)',
  },
  purple: {
    50: '#EB1EEF',
    100: '#843FDB',
  },
  blue: {
    50: '#31F9EE',
    100: '#02874D',
    200: '#1C4C83',
  },
  red: {
    50: '#CD5C5C',
    100: '#E70E00',
    200: '#B11616',
  },
} as const;

export type Theme = {
  absPillBottom: string;

  auth: {
    activityIndicator: string;
    logoContainerBackground: string;
    background: string;
    title: string;
    description: string;
  };
  // routeInput: {
  //   placeholder: string;
  // };
  showMoreTrails: {
    icon: string;
    background: string;
  };
  profileCard: {
    moreIcon: string;
    distancePill: string;
    socialButtonBackground: string;
    grad: {
      start: string;
      end: string;
    };
    followButton: {
      followedBackground: string;
      nonFollowedBackground: string;
      followedLabel: string;
      nonFollowedLabel: string;
    };
  };
  mapTiles: {
    mapBackground: string;
    mapEarth: string;
    mapLandcover: string;
    mapWater: string;
    mapLanduse: string;
    mapRoads: string;
    mapBuildings: string;
    mapBuildingOutline: string;
  };
  contrast: string;
  poiList: {
    grabIcon: string;
    header: {
      title: string;
      background: string;
    };
  };
  toast: {
    success: {
      label: string;
      background: string;
    };
    warning: {
      label: string;
      background: string;
    };
    error: {
      label: string;
      background: string;
    };
  };
  routePlanner: {
    background: string;
    border: string;
  };
  skeleton: string;
  defaultTitle: string;
  defaultBackground: string;
  defaultLabel: string;
  defaultBorder: string;
  delicateBorder: string;
  userList: {
    divider: string;
  };
  map: {
    loadingIndicator: string;
  };
  icon: {
    unimplemented: string;
  };
  toggle: {
    knob: string;
    activeTrack: string;
    inactiveTrack: string;
  };
  hikeReview: {
    title: string;
    placeholder: string;
  };
  hikeMetrics: {
    tracked: {
      label: string;
      value: string;
      background: string;
      margin: string;
    };
    planned: {
      label: string;
      value: string;
      background: string;
      margin: string;
    };
    tracking: {
      label: string;
      value: string;
    };
  };
  backdrop: string;
  header: {
    icon: string;
    background: string;
    bottomFadingShadow: string;
    borderBottom: string;
    title: string;
  };
  pill: {
    activeBackground: string;
    activeBorder: string;
    activeLabel: string;
    inactiveBackground: string;
    inactiveBorder: string;
    inactiveLabel: string;
  };
  listModal: {
    item: {
      border: string;
      background: string;
      text: string;
      icon: string;
    };
    dangerZone: string;
  };
  choiceModal: {
    header: {
      title: string;
      background: string;
    };
    body: {
      description: string;
      background: string;
    };
  };
  locationModal: {
    titleBackground: string;
  };
  bottomSheet: {
    background: string;
    handle: string;
    divider: {
      leftLine: string;
      circle: string;
      rightLine: string;
    };
  };
  userAvatar: {
    svg: string;
    container: {
      border: string;
      background: string;
    };
    labelContainer: {
      border: string;
      background: string;
    };
    label: string;
  };
  recenterButton: {
    svg: string;
    label: string;
    border: string;
    background: string;
  };
  button: {
    primary: {
      label: string;
      background: string;
      border?: string;
    };
    secondary: {
      label: string;
      background: string;
      border: string;
    };
    tertiary: {
      label: string;
      background: string;
      border?: string;
    };
    quaternary: {
      label: string;
      background?: string;
      border?: string;
    };
    cta: {
      label: string;
      background: string;
      border: string;
    };
  };
  searchBar: {
    icon: string;
    placeholder: string;
    background: string;
    border: string;
    text: string;
  };
};
const NG = CHARTED_COLOR_PALETTE.neutralGreen;
const FG = CHARTED_COLOR_PALETTE.fullGreen;
const N = CHARTED_COLOR_PALETTE.neutral;
const RED = CHARTED_COLOR_PALETTE.red;
const CITRUS = CHARTED_COLOR_PALETTE.citrus;

/** #000000 Dark color schemes for expo-system-ui */
const DARK: Theme = {
  absPillBottom: NG[200],
  auth: {
    activityIndicator: FG[50],
    logoContainerBackground: NG[700],
    background: N[300],
    title: NG[500],
    description: NG[500],
  },
  showMoreTrails: {
    icon: NG[800],
    background: NG[700],
  },
  profileCard: {
    moreIcon: NG[50],
    distancePill: NG[400],
    socialButtonBackground: NG[700],
    grad: {
      start: NG[800],
      end: NG[700],
    },
    followButton: {
      followedBackground: NG[500],
      nonFollowedBackground: FG[300],
      followedLabel: NG[800],
      nonFollowedLabel: NG[50],
    },
  },
  mapTiles: {
    mapBackground: '#0B1F1A',
    mapEarth: '#1E2D24',
    mapLandcover: '#2F5D3A',
    mapWater: '#1C3A5A',
    mapLanduse: '#1A1A1A',
    mapRoads: '#5A6B63',
    mapBuildings: '#2A2A2A',
    mapBuildingOutline: '#121212',
  },
  routePlanner: {
    background: NG[800],
    border: NG[50],
  },
  contrast: N[400],
  poiList: {
    grabIcon: NG[300],
    header: {
      title: N[50],
      background: NG[700],
    },
  },
  toast: {
    success: {
      label: FG[50],
      background: N[300],
    },
    warning: {
      label: N[400],
      background: CITRUS[300],
    },
    error: {
      label: N[50],
      background: RED[200],
    },
  },

  skeleton: NG[800],

  defaultTitle: NG[50],
  defaultBackground: NG[700],
  defaultLabel: NG[50],
  defaultBorder: NG[50],
  delicateBorder: NG[400],

  map: {
    loadingIndicator: FG[100],
  },
  userList: {
    divider: NG[50],
  },

  toggle: {
    knob: NG[100],
    activeTrack: FG[300],
    inactiveTrack: NG[500],
  },
  hikeReview: {
    title: NG[50],
    placeholder: NG[400],
  },
  hikeMetrics: {
    tracked: {
      label: NG[50],
      value: NG[50],
      background: NG[700],
      margin: NG[50],
    },
    planned: {
      label: NG[800],
      value: NG[800],
      background: NG[300],
      margin: NG[800],
    },
    tracking: {
      label: NG[50],
      value: NG[50],
    },
  },
  icon: {
    unimplemented: CITRUS[200],
  },
  header: {
    icon: NG[50],
    background: N[300],
    bottomFadingShadow: N[300],
    borderBottom: NG[50],
    title: NG[50],
  },
  pill: {
    activeBackground: FG[300],
    activeBorder: NG[800],
    activeLabel: NG[50],
    inactiveBackground: FG[200],
    inactiveBorder: FG[200],
    inactiveLabel: NG[800],
  },

  backdrop: FG['400-40pc'],

  listModal: {
    item: {
      border: NG[50],
      background: NG[800],
      text: NG[50],
      icon: NG[50],
    },
    dangerZone: RED[200],
  },
  choiceModal: {
    header: {
      title: N[50],
      background: N[300],
    },
    body: {
      description: NG[50],
      background: N[400],
    },
  },
  locationModal: {
    titleBackground: FG[400],
  },
  bottomSheet: {
    background: N[300],
    handle: NG[400],
    divider: {
      leftLine: NG[500],
      rightLine: NG[500],
      circle: NG[500],
    },
  },
  userAvatar: {
    svg: NG[200],
    container: {
      border: NG[800],
      background: N[200],
    },
    labelContainer: {
      border: NG[400],
      background: NG[700],
    },
    label: NG[50],
  },
  recenterButton: {
    svg: NG[50],
    label: NG[50],
    border: NG[800],
    background: FG[300],
  },
  button: {
    primary: {
      label: NG[800],
      background: FG[200],
      border: NG[800],
    },
    secondary: {
      label: NG[50],
      background: FG[300],
      border: NG[800],
    },
    tertiary: {
      label: NG[800],
      background: NG[400],
    },
    quaternary: {
      label: FG[200],
      border: NG[800],
    },
    cta: {
      label: NG[50],
      background: FG[100],
      border: NG[800],
    },
  },

  searchBar: {
    icon: NG[400],
    placeholder: NG[400],
    background: NG[800],
    border: NG[50],
    text: NG[50],
  },
} as const;

/** #ffffff Light color scheme for expo-system-ui */
const LIGHT: Theme = {
  absPillBottom: NG[200],

  auth: {
    activityIndicator: FG[300],
    logoContainerBackground: NG[100],
    background: N[100],
    title: NG[600],
    description: NG[600],
  },
  showMoreTrails: {
    icon: NG[300],
    background: NG[200],
  },
  profileCard: {
    moreIcon: NG[800],
    distancePill: NG[400],
    socialButtonBackground: NG[100],
    grad: {
      start: NG[300],
      end: NG[200],
    },
    followButton: {
      followedBackground: FG[200],
      nonFollowedBackground: FG[300],
      followedLabel: NG[800],
      nonFollowedLabel: NG[50],
    },
  },
  mapTiles: {
    mapBackground: '#a1aab2',
    mapEarth: '#799571',
    mapLandcover: '#62835a',
    mapWater: '#94cbff',
    mapLanduse: '#b5beac',
    mapRoads: '#ffffff',
    mapBuildings: '#8b8a83',
    mapBuildingOutline: '#6c727a',
    //   mapBackground: '#cbd7e3',
    //   mapEarth: '#d1ead7',
    //   mapLandcover: '#cfe8c9',
    //   mapWater: '#bcdefe',
    //   mapLanduse: '#eee9df',
    //   mapRoads: '#ffffff',
    //   mapBuildings: '#dfd5d5',
    //   mapBuildingOutline: '#c2c7ce',
  },
  routePlanner: {
    background: NG[200],
    border: NG[800],
  },
  contrast: N[50],
  poiList: {
    grabIcon: NG[500],
    header: {
      title: N[50],
      background: NG[600],
    },
  },
  toast: {
    success: {
      label: N[400],
      background: FG[50],
    },
    warning: {
      label: N[400],
      background: CITRUS[200],
    },
    error: {
      label: N[50],
      background: RED[200],
    },
  },
  skeleton: NG[100],
  defaultTitle: NG[800],
  defaultBackground: NG[100],
  defaultLabel: NG[800],
  defaultBorder: NG[800],
  delicateBorder: NG[500],
  map: {
    loadingIndicator: FG[50],
  },
  userList: {
    divider: NG[800],
  },
  toggle: {
    knob: NG[100],
    activeTrack: FG[300],
    inactiveTrack: FG[200],
  },
  hikeReview: {
    title: NG[800],
    placeholder: NG[600],
  },
  hikeMetrics: {
    tracked: {
      label: NG[800],
      value: NG[800],
      background: NG[300],
      margin: NG[800],
    },
    planned: {
      label: N[50],
      value: NG[50],
      background: N[300],
      margin: N[50],
    },
    tracking: {
      label: NG[800],
      value: NG[800],
    },
  },
  icon: {
    unimplemented: CITRUS[300],
  },
  header: {
    icon: NG[800],
    background: N[100],
    bottomFadingShadow: N[100],
    borderBottom: NG[800],
    title: NG[800],
  },
  pill: {
    activeBackground: FG[200],
    activeBorder: NG[800],
    activeLabel: NG[800],
    inactiveBackground: FG[300],
    inactiveBorder: FG[300],
    inactiveLabel: N[100],
  },
  backdrop: FG['300-30pc'],
  listModal: {
    item: {
      border: NG[800],
      background: NG[100],
      text: NG[800],
      icon: NG[800],
    },
    dangerZone: RED[200],
  },
  choiceModal: {
    header: {
      title: N[50],
      background: N[300],
    },
    body: {
      description: NG[800],
      background: N[50],
    },
  },
  locationModal: {
    titleBackground: FG[300],
  },
  bottomSheet: {
    background: N[100],
    handle: NG[700],
    divider: {
      leftLine: NG[600],
      rightLine: NG[600],
      circle: NG[600],
    },
  },
  userAvatar: {
    svg: NG[50],
    container: {
      border: NG[500],
      background: N[200],
    },
    labelContainer: {
      border: NG[500],
      background: NG['300-85pc'],
    },
    label: NG[800],
  },
  recenterButton: {
    svg: NG[800],
    label: NG[800],
    border: NG[800],
    background: FG[200],
  },
  button: {
    primary: {
      label: N[50],
      background: FG[300],
      border: NG[800],
    },
    secondary: {
      label: NG[800],
      background: FG[200],
      border: FG[400],
    },
    tertiary: {
      label: N[50],
      background: NG[700],
    },
    quaternary: {
      label: FG[400],
      border: NG[800],
    },
    cta: {
      label: NG[800],
      background: FG[50],
      border: NG[800],
    },
  },
  searchBar: {
    icon: N[200],
    placeholder: N[200],
    background: NG[100],
    border: NG[800],
    text: NG[800],
  },
} as const;

export const THEMES = { light: LIGHT, dark: DARK } as const;
export type AppTheme = Theme;
