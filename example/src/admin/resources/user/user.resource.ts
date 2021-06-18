import { ResourceWithOptions } from 'admin-bro';
import { User } from './user.entity';
import uploadFeature from '@admin-bro/upload';
import path from 'path';

export const createUserResource = (): ResourceWithOptions => ({
  resource: User,
  options: {
    navigation: {
      icon: 'User',
      name: 'Users',
    },
  },
  features: [
    // uploadFeature({
    //   provider: {
    //     local: { bucket: path.join(process.cwd(), '/public/users') },
    //   },
    //   properties: {
    //     file: `photo.file`,
    //     filePath: `photo.path`,
    //     filename: `photo.filename`,
    //     filesToDelete: `photo.toDelete`,
    //     key: `photo.s3Key`,
    //     mimeType: `photo.mimeType`,
    //   },
    // }),
  ],
});
