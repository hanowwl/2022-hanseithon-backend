const PASSWORD_REGEX =
  /^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%#?&]{8,16}$/;
const USERNAME_REGEX = /^[a-z0-9$@$!%#?&]{4,16}$/;
const NAME_REGEX = /^[가-힣]{2,4}$/;
const PHONE_REGEX = /01[0-1, 7][0-9]{7,8}$/;

export { PASSWORD_REGEX, USERNAME_REGEX, NAME_REGEX, PHONE_REGEX };
