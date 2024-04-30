import { diskStorage } from 'multer';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export const multerFilesConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'files');
    },
    filename: (req, file, cb) => {
      const uniqueFilename: string = `${uuidv4()}-${slugify(file.originalname)}`;

      cb(null, uniqueFilename);
    },
  }),
};
