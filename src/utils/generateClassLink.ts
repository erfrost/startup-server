import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

export const generateClassLink = () => {
  return process.env.CLIENT_BASE_URL + 'joinToClass/' + uuidv4();
};

export default generateClassLink;
