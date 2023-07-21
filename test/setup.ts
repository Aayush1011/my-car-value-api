import { rm } from 'fs/promises';
import { join } from 'path';
import { AppDataSource } from '@src/config/data-source';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

global.afterEach(async () => {
  await AppDataSource.destroy();
});
