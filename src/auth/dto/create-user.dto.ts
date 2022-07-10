import { IsEmail, IsNotEmpty, Matches, Max, Min } from 'class-validator';
import {
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from 'src/constants';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(USERNAME_REGEX, {
    message: '4~16자 영문, 숫자, 특수문자를 입력해주세요',
  })
  username: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message: '8~16자 영문, 숫자, 특수문자 조합을 입력해주세요',
  })
  password: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message: '8~16자 영문, 숫자, 특수문자 조합을 입력해주세요',
  })
  passwordCheck: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PHONE_REGEX, {
    message: '8~16자 영문, 숫자, 특수문자 조합을 입력해주세요',
  })
  phone: string;

  @IsNotEmpty()
  @Matches(NAME_REGEX, {
    message: '2~4자 이름을 입력해주세요',
  })
  name: string;

  @IsNotEmpty()
  studentDepartment: string;

  @IsNotEmpty()
  @Min(1, { message: '학년은 1보다 작아서는 안됩니다.' })
  @Max(3, { message: '학년은 3보다 크지 않아야 합니다.' })
  studentGrade: number;

  @IsNotEmpty()
  @Min(1, { message: '반은 1보다 작아서는 안됩니다.' })
  @Max(2, { message: '반은 2보다 크지 않아야 합니다.' })
  studentClassroom: number;

  @IsNotEmpty()
  @Min(1, { message: '번호는 1보다 작아서는 안됩니다.' })
  @Max(30, { message: '번호는 30보다 크지 않아야 합니다.' })
  studentNumber: number;
}
