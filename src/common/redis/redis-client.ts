import Redis from "ioredis";


export class RedisClient {
  private redisConnection: Redis;
  private static instance: RedisClient;

  private constructor() {
    const redisHost = process.env.REDIS_HOST || "redis";
    const redisPort = parseInt(process.env.REDIS_PORT || "6379");

    this.redisConnection = new Redis({
      host: redisHost,
      port: redisPort,
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  async getCachedKey(key: string): Promise<string | null> {
    const cachedValue = await this.redisConnection.get(key);

    return cachedValue;
  }

  async setCacheKeyAndValue(key: string, value: any): Promise<string> {
    const success = await this.redisConnection.set(key, value);

    return success;
  }

  async clearKey(key: string): Promise<number> {
    return await this.redisConnection.del(key)
  }
}
