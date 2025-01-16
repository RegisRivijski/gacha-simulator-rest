import AmplitudeSingleton from '../ServiceSingletons/AmplitudeSingleton.js';

class AnalyticService {
  amplitudeInstance = null;

  constructor(amplitude) {
    this.amplitudeInstance = amplitude;
  }

  logEvent({
    eventType,
    userId,
    eventProperties,
  }) {
    return this.amplitudeInstance.logEvent({
      event_type: eventType,
      user_id: String(userId),
      event_properties: eventProperties,
    });
  }
}

export default new AnalyticService(AmplitudeSingleton);
