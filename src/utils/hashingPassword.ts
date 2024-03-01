import * as bcrypt from 'bcrypt';

export const hashingPassword = async (password: string): Promise<string> => {
  const saltOrRounds: number = 10;
  const hash: string = await bcrypt.hash(password, saltOrRounds);

  return hash;
};

export default hashingPassword;
