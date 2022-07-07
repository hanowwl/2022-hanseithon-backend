import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  TEAM_MEMBER_POSITION_TYPE,
  TEAM_MEMBER_POSITION_VALUES,
} from 'src/constants/type';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(14)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TEAM_MEMBER_POSITION_VALUES)
  position: TEAM_MEMBER_POSITION_TYPE;
}
