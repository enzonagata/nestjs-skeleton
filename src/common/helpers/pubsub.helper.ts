import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';

@Injectable()
export class PubSubHelper implements OnModuleInit {
  private readonly logger = new Logger(PubSubHelper.name);

  private pubSubClient: PubSub;

  private subscriptionCallbacks: Map<
    string,
    Array<(message: Message) => Promise<void> | void>
  > = new Map();

  private subscriptions: Map<string, Subscription> = new Map();

  constructor() {
    this.pubSubClient = new PubSub({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async onModuleInit() {
    this.logger.log('PubSubHelper iniciado');
  }

  public async subscribeToTopic(
    topicName: string,
    subscriptionName: string,
    callback: (message: Message) => Promise<void> | void,
  ): Promise<void> {
    if (!this.subscriptionCallbacks.has(subscriptionName)) {
      this.subscriptionCallbacks.set(subscriptionName, []);
    }
    this.subscriptionCallbacks.get(subscriptionName).push(callback);

    if (!this.subscriptions.has(subscriptionName)) {
      const subscription: Subscription = this.pubSubClient
        .topic(topicName)
        .subscription(subscriptionName);

      subscription.on('message', async (message: Message) => {
        this.logger.debug(
          `Mensagem recebida na subscription '${subscriptionName}': ID = ${message.id}`,
        );

        const callbacks = this.subscriptionCallbacks.get(subscriptionName);

        try {
          await Promise.all(callbacks.map((cb) => cb(message)));
          this.logger.debug(
            `Mensagem ID = ${message.id} ACK na subscription '${subscriptionName}'.`,
          );
        } catch (error) {
          this.logger.error(
            `Erro ao processar a mensagem ID = ${message.id}: ${error.message}. Fazendo NACK...`,
          );
          message.nack();
        }
      });

      subscription.on('error', (error: Error) => {
        this.logger.error(
          `Erro na subscription '${subscriptionName}': ${error.message}`,
        );
      });

      this.subscriptions.set(subscriptionName, subscription);
      this.logger.log(
        `Subscription '${subscriptionName}' para o tópico '${topicName}' iniciada com sucesso.`,
      );
    }
  }

  public async publishMessage(topicName: string, data: any): Promise<string> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await this.pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      this.logger.log(
        `Mensagem publicada com ID: ${messageId} no tópico ${topicName}`,
      );
      return messageId;
    } catch (error) {
      this.logger.error(
        `Erro ao publicar mensagem no tópico ${topicName}: ${error.message}`,
      );
      throw error;
    }
  }
}
