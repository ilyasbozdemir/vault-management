import PubSub from 'pubsub-js';
import eventTypes from './eventTypes';

const EventManager = {
  publish(event, data) {
    if (eventTypes[event]) {
      PubSub.publish(eventTypes[event], data);
    } else {
      console.error(`Invalid event type: ${event}`);
    }
  },

  subscribe(event, callback) {
    if (eventTypes[event]) {
      return PubSub.subscribe(eventTypes[event], callback);
    } else {
      console.error(`Invalid event type: ${event}`);
    }
  },

  unsubscribe(token) {
    PubSub.unsubscribe(token);
  }
};

export default EventManager;