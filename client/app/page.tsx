'use client'
import { useState } from 'react';
import handlerConsumer from './kafkaConsumer';

export default function KafkaConsumerPage() {
  const [consumerStatus, setConsumerStatus] = useState();

  async function startConsumer() {
    const messages = await handlerConsumer();
  }

  return (
    <div>
      <h1>Kafka Consumer</h1>
      <button onClick={startConsumer}>Start Consumer</button>
      <p>Status: {consumerStatus}</p>
    </div>
  );
}
