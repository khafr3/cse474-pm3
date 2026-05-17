const { Kafka } = require('kafkajs');
const { upsertFileIndex, deleteFileIndex } = require('./models/searchModel');
const kafka = new Kafka({
  clientId: 'search-index',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'search-index-group' });
const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ['upload.completed', 'file.deleted'], fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      if (topic === 'upload.completed') {
        const { file_id, file_name } = event.data;
        await upsertFileIndex(file_id, file_name, '');
        console.log(`Indexed new file ${file_id}`);
      } else if (topic === 'file.deleted') {
        const { file_id } = event.data;
        await deleteFileIndex(file_id);
        console.log(`Deleted file ${file_id} from index`);
      }
    },
  });
};
module.exports = { startConsumer };
