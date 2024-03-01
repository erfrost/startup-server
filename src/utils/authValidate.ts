interface PasswordValidateReturn {
  uppercaseCount: number;
  digitCount: number;
}

const roles: string[] = ['student', 'teacher', 'tutor'];

export const authValidate = (
  nickname: string,
  email: string,
  password: string,
  role: string,
): any => {
  if (!email || !password || !nickname || !role) return false;

  if (!nickname.length) return false;

  if (!email.includes('@')) return false;

  if (password.length < 8) return false;

  const passwordValidateResult: PasswordValidateReturn =
    passwordValidate(password);

  if (passwordValidateResult.uppercaseCount === 0) return false;

  if (passwordValidateResult.digitCount === 0) return false;

  if (!roles.includes(role)) return false;

  return true;
};

const passwordValidate = (password: string): PasswordValidateReturn => {
  let uppercaseCount: number = 0;
  let digitCount: number = 0;

  for (let i: number = 0; i < password.length; i++) {
    const char: string = password[i];
    if (char >= 'A' && char <= 'Z') uppercaseCount++;
    else if (char >= '0' && char <= '9') digitCount++;
  }

  return { uppercaseCount, digitCount };
};
