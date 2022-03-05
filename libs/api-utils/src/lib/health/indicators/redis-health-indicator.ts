// Copied from https://github.com/liaoliaots/nestjs-redis/blob/main/lib/health/indicators/redis.health.ts

import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { promiseTimeout } from '@nestjs/terminus/dist/utils';
import { Cluster, Redis } from 'ioredis';
import { RedisError } from 'redis-errors';

const CANNOT_BE_READ = `Info cluster cannot be read.`;
const FAILED_CLUSTER_STATE = `Info cluster is not on OK state.`;
const CLIENT_NOT_FOUND_FOR_HEALTH = `The client-provider was not found in the application context.`;

export interface RedisCheckOptions {
  /**
   * The client which the health check should get executed.
   */
  client: Redis | Cluster;
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  /**
   * Checks a redis or cluster connection.
   *
   * @param key - The key which will be used for the result object
   * @param options - The options for check
   *
   * @example
   * ```
   * import IORedis from 'ioredis';
   *
   * const client = new IORedis({ host: '127.0.0.1', port: 6380 });
   * indicator.checkHealth('redis', { client });
   * ```
   *
   * @example
   * ```
   * import IORedis from 'ioredis';
   *
   * const client = new IORedis.Cluster([{ host: '127.0.0.1', port: 16380 }]);
   * indicator.checkHealth('cluster', { client });
   * ```
   */
  async checkHealth(key: string, options: RedisCheckOptions): Promise<HealthIndicatorResult> {
    try {
      await this.testHealth(options);
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: error.message });
    }
  }

  private async testHealth({ client }: RedisCheckOptions) {
    if (!client) {
      throw new RedisError(CLIENT_NOT_FOUND_FOR_HEALTH);
    }

    if (client instanceof Cluster) {
      // * is cluster
      const clusterInfo = await client.cluster('info');
      if (typeof clusterInfo !== 'string' || !clusterInfo) {
        throw new RedisError(CANNOT_BE_READ);
      }
      if (!clusterInfo.includes('cluster_state:ok')) {
        throw new RedisError(FAILED_CLUSTER_STATE);
      }
    } else {
      // * is redis
      return await promiseTimeout(5000, client.ping());
    }
  }
}
