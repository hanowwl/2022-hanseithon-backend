import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  TEAM_MEMBER_POSITION_TYPE,
  TEAM_MEMBER_POSITION_VALUES,
} from 'src/constants/type';

export class UpdateMemberPositionDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(TEAM_MEMBER_POSITION_VALUES)
  position: TEAM_MEMBER_POSITION_TYPE;
}
