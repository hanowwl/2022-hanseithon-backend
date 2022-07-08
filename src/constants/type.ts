export const TEAM_MEMBER_POSITION_VALUES = [
  'FRONT',
  'BACK',
  'FULL-STACK',
  'PM',
  'DESIGN',
] as const;
export type TEAM_MEMBER_POSITION_TYPE =
  typeof TEAM_MEMBER_POSITION_VALUES[number];
