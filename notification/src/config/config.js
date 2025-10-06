import { config as dotenvConfig } from 'dotenv';
dotenvConfig();



const _config = {
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    JWT_SECRET: process.env.JWT_SECRET,
}


export default Object.freeze(_config);