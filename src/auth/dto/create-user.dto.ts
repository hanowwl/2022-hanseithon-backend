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
    message: '최소 4자, 최대 16자까지 영문, 숫자, 특수문자만 입력 가능해요',
  })
  username: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      '최소 8자, 최대 16자까지 영문, 숫자, 특수문자 조합만 입력 가능해요',
  })
  password: string;

  @IsNotEmpty()
  @Matches(PASSWORD_REGEX, {
    message:
      '최소 8자, 최대 16자까지 영문, 숫자, 특수문자 조합만 입력 가능해요',
  })
  passwordCheck: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(PHONE_REGEX, {
    message: '최소 10자, 최대 11자까지인 올바른 전화번호만 입력 가능해요',
  })
  phone: string;

  @IsNotEmpty()
  @Matches(NAME_REGEX, {
    message: '최소 2자, 최대 4자까지인 올바른 이름을 입력해주세요',
  })
  name: string;

  @IsNotEmpty()
  studentDepartment: string;

  @IsNotEmpty()
  @Min(1, { message: '학년은 1보다 작아서는 안돼요' })
  @Max(3, { message: '학년은 3보다 크지 않아야 해요.' })
  studentGrade: number;

  @IsNotEmpty()
  @Min(1, { message: '반은 1보다 작아서는 안돼요' })
  @Max(2, { message: '반은 2보다 크지 않아야 해요' })
  studentClassroom: number;

  @IsNotEmpty()
  @Min(1, { message: '번호는 1보다 작아서는 안돼요' })
  @Max(30, { message: '번호는 30보다 크지 않아야 해요' })
  studentNumber: number;
}
