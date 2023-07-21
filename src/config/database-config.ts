require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import { DataSourceOptions } from 'typeorm';

import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME,
  entities: [User, Report],
  synchronize: true,
};
