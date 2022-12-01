import { Request } from 'express';
import { Fields, Files, IncomingForm } from 'formidable';

export type ImageFile = File & {
  filepath: string;
  originalFilename: string;
  mimetype: string;
};

export const parseForm = (req: Request) => {
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) reject(err);
      resolve({ fields: fields, files: files });
    });
  });
};
