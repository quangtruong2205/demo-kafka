'use server'
import { Kafka, KafkaMessage } from 'kafkajs';
import { useState } from 'react';

const kafka = new Kafka({
  clientId: 'my-client',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-client-group' });

export default async function handlerConsumer() {
    let messages: KafkaMessage[] = [];
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'file-upload-topic' });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if(message) messages.push(message)
          console.log({
            topic, partition, message,
          });
        },
      });

      return messages;
    } catch (error) {
      console.log('error: ', error);
      return JSON.stringify(error);
    }
}
