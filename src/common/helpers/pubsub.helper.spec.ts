import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { PubSub, Topic, Subscription, Message } from '@google-cloud/pubsub';
import { PubSubHelper } from './pubsub.helper';

jest.mock('@google-cloud/pubsub', () => {
  const subscriptionMock: Partial<Subscription> = {
    on: jest.fn(),
  };

  const topicMock: Partial<Topic> = {
    subscription: jest.fn().mockReturnValue(subscriptionMock),
    publishMessage: jest.fn(),
  };

  const pubSubClientMock: Partial<PubSub> = {
    topic: jest.fn().mockReturnValue(topicMock),
  };

  return {
    PubSub: jest.fn(() => pubSubClientMock),
  };
});

describe('PubSubHelper', () => {
  let pubSubHelper: PubSubHelper;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PubSubHelper],
    }).compile();

    pubSubHelper = module.get<PubSubHelper>(PubSubHelper);

    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('onModuleInit', () => {
    it('should log the initialization message', async () => {
      await pubSubHelper.onModuleInit();
      expect(loggerSpy).toHaveBeenCalledWith('PubSubHelper iniciado');
    });
  });

  describe('subscribeToTopic', () => {
    it('should create a new subscription if it does not exist and register the callback', async () => {
      const topicName = 'test-topic';
      const subscriptionName = 'test-sub';
      const callback = jest.fn();

      await pubSubHelper.subscribeToTopic(
        topicName,
        subscriptionName,
        callback,
      );
      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;
      expect(PubSubMock.topic).toHaveBeenCalledWith(topicName);

      const topicMock = PubSubMock.topic.mock.results[0].value;
      expect(topicMock.subscription).toHaveBeenCalledWith(subscriptionName);

      const subscriptionMock = topicMock.subscription.mock.results[0].value;
      expect(subscriptionMock.on).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      );

      await pubSubHelper.subscribeToTopic(
        topicName,
        subscriptionName,
        callback,
      );
    });

    it('should call the callback when a message event is received', async () => {
      const topicName = 'test-topic';
      const subscriptionName = 'test-sub';
      const callback = jest.fn();

      await pubSubHelper.subscribeToTopic(
        topicName,
        subscriptionName,
        callback,
      );

      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;
      const topicMock = PubSubMock.topic.mock.results[0].value;
      const subscriptionMock = topicMock.subscription.mock.results[0].value;

      const onMessageHandler = (
        subscriptionMock.on as jest.Mock
      ).mock.calls.find((call) => call[0] === 'message')[1];

      const mockMessage: Partial<Message> = {
        id: 'fake-id',
        ack: jest.fn(),
        nack: jest.fn(),
      };

      await onMessageHandler(mockMessage);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(mockMessage);
    });

    it('should NACK the message if an error occurs inside the callback', async () => {
      const topicName = 'test-topic';
      const subscriptionName = 'test-sub';
      const callback = jest
        .fn()
        .mockRejectedValue(new Error('Erro no callback'));

      await pubSubHelper.subscribeToTopic(
        topicName,
        subscriptionName,
        callback,
      );

      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;
      const topicMock = PubSubMock.topic.mock.results[0].value;
      const subscriptionMock = topicMock.subscription.mock.results[0].value;

      const onMessageHandler = (
        subscriptionMock.on as jest.Mock
      ).mock.calls.find((call) => call[0] === 'message')[1];

      const mockMessage: Partial<Message> = {
        id: 'fake-id',
        ack: jest.fn(),
        nack: jest.fn(),
      };

      await onMessageHandler(mockMessage);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(mockMessage.ack).not.toHaveBeenCalled();
      expect(mockMessage.nack).toHaveBeenCalled();
    });

    it('should log an error if an error occurs on subscription.on("error")', async () => {
      const topicName = 'test-topic';
      const subscriptionName = 'test-sub';
      const callback = jest.fn();

      await pubSubHelper.subscribeToTopic(
        topicName,
        subscriptionName,
        callback,
      );

      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;
      const topicMock = PubSubMock.topic.mock.results[0].value;
      const subscriptionMock = topicMock.subscription.mock.results[0].value;

      const onErrorHandler = (subscriptionMock.on as jest.Mock).mock.calls.find(
        (call) => call[0] === 'error',
      )[1];

      const fakeError = new Error('ErroFake');
      onErrorHandler(fakeError);

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        `Erro na subscription '${subscriptionName}': ${fakeError.message}`,
      );
    });
  });

  describe('publishMessage', () => {
    it('should publish a message successfully', async () => {
      const topicName = 'test-topic';
      const data = { foo: 'bar' };
      const fakeMessageId = 'fake-msg-id';
      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;

      const topicMock: Partial<Topic> = {
        publishMessage: jest.fn().mockResolvedValue(fakeMessageId),
      };

      PubSubMock.topic = jest.fn().mockReturnValue(topicMock);

      const messageId = await pubSubHelper.publishMessage(topicName, data);

      expect(PubSubMock.topic).toHaveBeenCalledWith(topicName);
      expect(topicMock.publishMessage).toHaveBeenCalledWith({
        data: Buffer.from(JSON.stringify(data)),
      });
      expect(messageId).toBe(fakeMessageId);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Mensagem publicada com ID: ${fakeMessageId} no tópico ${topicName}`,
      );
    });

    it('should throw an error when publication fails', async () => {
      const topicName = 'test-topic';
      const data = { foo: 'bar' };
      const fakeError = new Error('FalhaPub');

      const PubSubMock = (PubSub as unknown as jest.Mock).mock.results[0].value;

      const topicMock: Partial<Topic> = {
        publishMessage: jest.fn().mockRejectedValue(fakeError),
      };

      PubSubMock.topic = jest.fn().mockReturnValue(topicMock);

      await expect(
        pubSubHelper.publishMessage(topicName, data),
      ).rejects.toThrow('FalhaPub');

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        `Erro ao publicar mensagem no tópico ${topicName}: ${fakeError.message}`,
      );
    });
  });
});
