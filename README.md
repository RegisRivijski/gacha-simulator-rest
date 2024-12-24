# Gacha Simulator REST API

The gacha-simulator-rest is a microservice that powers the core business logic of the Genshin Impact Telegram bot. It handles user management, gacha mechanics, banner configurations, and integrates with external services like Redis and MongoDB for enhanced performance and scalability.

## Features

 - User Management: Manage user profiles, inventories, and gacha histories.
 - Gacha Mechanics: Simulate single or multi-pull wishes with detailed banner configurations.
 - Banner Management: Support for dynamic event banners, character banners, and weapon banners.
 - Admin Panel: Tools for managing users, banners, analytics, and advertisements.
 - Localization: Multi-language support with dynamic template rendering.
 - Rate Limiting: Integration with Redis to ensure fair usage and prevent abuse.
 - Error Monitoring: Uses Sentry for error tracking and diagnostics.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RegisRivijski/gacha-simulator-rest.git
cd gacha-simulator-rest
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file with the following variables:

```dotenv
GACHA_SIMULATOR_REST_PORT=3000
GACHA_SIMULATOR_REST_API_KEY=your_api_key
GACHA_SIMULATOR_REST_DEFAULT_LANGUAGE_CODE=en
MONGODB_1_HOSTNAME=your_mongodb_url
MONGO_INITDB_ROOT_USERNAME=your_mongo_username
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password
REDIS_URL=your_redis_url
REDIS_HOSTNAME=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
SENTRY_GENSHIN_GACHA_SIMULATOR_REST_API_DSN=your_sentry_dsn
```

4. Start the server:

```bash
npm start
```

## Technologies Used

 - Node.js: Core runtime for backend development.
 - Koa.js: Web framework for REST API.
 - MongoDB: NoSQL database for persistent storage.
 - Redis: High-performance caching and rate-limiting.
 - Sentry: Error tracking and monitoring.
 - EJS: Template engine for rendering dynamic messages.
 - Axios: HTTP client for third-party integrations.

## Contribution

Contributions are welcome! Please feel free to open issues or submit pull requests to improve the service.

## Disclaimer

This service is intended for educational and entertainment purposes only. It simulates gacha mechanics and does not guarantee real-world probabilities.
