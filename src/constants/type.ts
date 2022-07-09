export const TEAM_MEMBER_POSITION_VALUES = [
  'DEVELOPER',
  'PM',
  'DESIGN',
] as const;
export type TEAM_MEMBER_POSITION_TYPE =
  typeof TEAM_MEMBER_POSITION_VALUES[number];

export const TEAM_TYPE_VALUES = ['GAME', 'LIVING'];
export type TEAM_TYPE = typeof TEAM_TYPE_VALUES[number];
