import AmplitudeSingleton from '../classes/AmplitudeSingleton.js';

import * as analyticEventTypes from '../constants/analyticEventTypes.js';

export function logEvent({
  eventType,
  userId,
  eventProperties,
}) {
  if (!eventType || !analyticEventTypes.includes(eventType)) {
    throw new Error('Event type is missed or unknown');
  }
  if (!userId || !Number(userId)) {
    throw new Error('User id is missed or not a number');
  }
  return AmplitudeSingleton.logEvent({
    event_type: eventType,
    user_id: userId,
    event_properties: eventProperties,
  });
}
