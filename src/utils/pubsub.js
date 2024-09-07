import PubSub from 'pubsub-js';

// Abone olma işlevi
export const subscribeToNotifications = (callback) => {
    const token = PubSub.subscribe('cron-notification', (msg, data) => {
      callback(data);
    });
    return () => PubSub.unsubscribe(token);
  };

// Yayınlama işlevi
export const publishNotification = (message, cronData) => {
  PubSub.publish('cron-notification', { message, cronData });
};
