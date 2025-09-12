import fs from 'fs';
import path from 'path';

export default function deleteFiles(dir: string) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error(err);
        else console.log(`${file} deleted`);
      });
    });
  });
}
