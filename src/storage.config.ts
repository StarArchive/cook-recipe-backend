import path, { extname } from "path";

import { diskStorage } from "multer";

import { env } from "./config";

function generateFilename(file: Express.Multer.File) {
  return `${Date.now()}-${file.size}${extname(file.originalname)}`;
}

export const storage = diskStorage({
  destination: path.join(process.cwd(), env.UPLOAD_PATH),
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});
