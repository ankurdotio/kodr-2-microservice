import { config as dotenvConfig } from 'dotenv';
dotenvConfig();



const _config = {
    RABBITMQ_URI: process.env.RABBITMQ_URI
}


export default Object.freeze(_config);