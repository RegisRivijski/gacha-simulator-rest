import AmplitudeSingleton from '../classes/AmplitudeSingleton.js';

export function logEvent({
  eventType,
  userId,
  eventProperties,
}) {
  return AmplitudeSingleton.logEvent({
    event_type: eventType,
    user_id: String(userId),
    event_properties: eventProperties,
  });
}
