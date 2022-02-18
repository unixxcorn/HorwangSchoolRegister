import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

export const configuration = dotenv.config();
if (configuration.error)
    throw configuration.error;
if (!configuration.parsed)
    throw new Error('CannotParseData');

export const sequelize = new Sequelize(configuration.parsed.DATABASE, {
    logging: false
});
