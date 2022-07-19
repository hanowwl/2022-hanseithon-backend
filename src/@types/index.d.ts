/* eslint-disable */
import { Team, User } from 'src/entities';

interface ExpressUser extends User {
  team: Team;
}

declare global {
  namespace Express {
    export interface User extends ExpressUser {}
  }
}
