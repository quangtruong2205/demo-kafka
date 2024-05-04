import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer;
  private consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka-demo',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async publishChunk(chunk: Buffer) {
    console.log('chunk: ', chunk);
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'file-upload-topic',
        messages: [{ value: chunk }],
      });
    } catch (error) {
      console.error('Error publishing chunk to Kafka:', error);
    } finally {
      //   await this.producer.disconnect();
    }
  }

  async consumerHandler() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: 'file-upload-topic',
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            message,
            topic,
            partition,
          });
        },
      });

      return { message: 'Kafka consumer started' };
    } catch (error) {
      return { error: error?.message };
    }
  }
}
