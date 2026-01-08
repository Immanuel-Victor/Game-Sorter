import {beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals';
import type { Mock } from 'jest-mock';

const mockGet: Mock<(key: string) => Promise<string | null>> = jest.fn();
const mockSet: Mock<(key: string, value: string) => Promise<string>> = jest.fn();
const mockDel: Mock<(key: string) => Promise<number>> = jest.fn()

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
    del: mockDel,
  }));
});

import { RedisClient } from './redis-client';

describe('Redis client', () => {
  let redisClient1: RedisClient;

  beforeAll(() => {
    redisClient1 = RedisClient.getInstance();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should only have one instance', () => {
    const redisClient2 = RedisClient.getInstance();
    expect(redisClient1).toBe(redisClient2);
  });

  it('should store a key and value successfully', async () => {
    mockSet.mockResolvedValue('OK');
    
    const redisResult = await redisClient1.setCacheKeyAndValue('Key1', 'Value');

    expect(mockSet).toHaveBeenCalledWith('Key1', 'Value');
    expect(redisResult).toBe('OK');
  });

  it('Should get a stored key', async () => {
    mockGet.mockResolvedValue('Value');
    
    const redisResult = await redisClient1.getCachedKey('Key1');

    expect(mockGet).toHaveBeenCalledWith('Key1');
    expect(redisResult).toBe('Value');
  });

  it('Should return null for non-existent key', async () => {
    mockGet.mockResolvedValue(null);
    
    const redisResult = await redisClient1.getCachedKey('NonExistentKey');

    expect(mockGet).toHaveBeenCalledWith('NonExistentKey');
    expect(redisResult).toBeNull();
  });

  it('Should return 1 if a key is found and deleted', async () => {
    mockDel.mockResolvedValue(1);
    
    const redisResult = await redisClient1.clearKey('Key1');
    
    expect(mockDel).toHaveBeenCalledWith('Key1');
    expect(redisResult).toBe(1);
  });

  it('Should return 0 if key does not exist', async () => {
    mockDel.mockResolvedValue(0);
    
    const redisResult = await redisClient1.clearKey('NonExistentKey');
    
    expect(mockDel).toHaveBeenCalledWith('NonExistentKey');
    expect(redisResult).toBe(0);
  })
});