import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from 'src/constants/regex';

export class CreateUserDto {
  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  username: string;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MinLength(8, { message: '계정 보안을 위해 8글자 이상을 입력해주십시오.' })
  @Matches(PASSWORD_REGEX, {
    message: '영어, 숫자, 특수문자만 사용이 가능합니다.',
  })
  password: string;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MaxLength(11)
  phone: string;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MaxLength(4)
  name: string;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  studentDepartment: string;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MaxLength(3)
  studentGrade: number;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MaxLength(5)
  studentClassroom: number;

  @IsNotEmpty({ message: '이 항목은 필수 입력 항목입니다.' })
  @MaxLength(30)
  studentNumber: number;
}
