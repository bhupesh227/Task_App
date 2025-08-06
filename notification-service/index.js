import amqp from 'amqplib';


async function start() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('task_created');
    console.log('Notification service connected to RabbitMQ');
    channel.consume('task_created', (msg) => {
      const task = JSON.parse(msg.content.toString());
      console.log('New task created:', task.title);
      console.log('Sending notification for task:', task);
      channel.ack(msg);
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

start();



