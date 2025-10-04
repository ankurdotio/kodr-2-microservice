import ampq from 'amqplib';
import config from '../config/config.js';


let channel, connection;

export const connect = async () => {
    connection = await ampq.connect(config.RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log("RabbitMQ connected");
}

export const subscribeQueue = async (queueName, callback) => {
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async (data) => {

        const message = JSON.parse(data.content.toString());

        await callback(message);
        channel.ack(data);
    });
}