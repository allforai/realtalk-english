// Source: design.md Section 3.3 -- Deep link configuration
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['realtalk://', 'https://realtalk.app'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              ScenarioDetail: 'scenarios/:scenarioId',
            },
          },
          ReviewTab: {
            screens: {
              Review: 'reviews/today',
            },
          },
          ProfileTab: {
            screens: {
              StreaksAchievements: 'achievements',
            },
          },
        },
      },
      NotificationCenter: 'notifications',
    },
  },
};
