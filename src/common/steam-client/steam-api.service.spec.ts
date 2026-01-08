import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { Mock } from "jest-mock";

const mockAxiosRequest: Mock<(url: string, method: string, params: any) => Promise<any>> = jest.fn();
jest.mock("../axios-client/axios-client", () => ({
  AxiosClient: {
    request: mockAxiosRequest,
  },
}));

import { SteamClientService } from "./steam-client.service";
import { RedisClient } from "../redis/redis-client";

let steamClientService: SteamClientService;
let mockRedisClient: jest.Mocked<RedisClient>;

const mockSteamLibrary = {
  response: {
    game_count: 2,
    games: [
      { appid: "123", name: "Game 1", playtime_forever: "100" },
      { appid: "456", name: "Game 2", playtime_forever: "200" },
    ],
  },
};

const mockPrivateLibrary = {
    response: {}
}

beforeAll(() => {
  process.env.STEAM_URL = "https://api.steampowered.com";
  process.env.STEAM_CLIENT_KEY = "test-api-key";
});

beforeEach(() => {
  jest.clearAllMocks();

  mockRedisClient = {
    getCachedKey: jest.fn(),
    setCacheKeyAndValue: jest.fn(),
    clearKey: jest.fn(),
  } as unknown as jest.Mocked<RedisClient>;

  steamClientService = new SteamClientService(mockRedisClient);
});

describe("Steam Client", () => {
  it("Should make a request to steam and return a public user game library", async () => {
    mockAxiosRequest.mockResolvedValue(mockSteamLibrary);

    const result = await steamClientService.getUserGames("12345");

    expect(mockAxiosRequest).toHaveBeenCalledWith(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
      "get",
      {
        steamid: "12345",
        format: "json",
        key: "test-api-key",
        include_appinfo: true,
      }
    );
    expect(result).toEqual(mockSteamLibrary);
  });

    it("Should make a request to steam and return an empty result if user account is private", async () => {
    mockAxiosRequest.mockResolvedValue(mockPrivateLibrary);

    const result = await steamClientService.getUserGames("12345");

    expect(mockAxiosRequest).toHaveBeenCalledWith(
      "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/",
      "get",
      {
        steamid: "12345",
        format: "json",
        key: "test-api-key",
        include_appinfo: true,
      }
    );
    expect(result).toEqual(mockPrivateLibrary);
  });

  it("Should not make a request and get a previously searched user library by consulting the redisClient", async () => {
    mockRedisClient.getCachedKey.mockResolvedValue(JSON.stringify(mockSteamLibrary));
  
    const result = await steamClientService.getUserGames("12345");
  
    expect(mockRedisClient.getCachedKey).toHaveBeenCalledWith("12345");
    expect(mockAxiosRequest).not.toHaveBeenCalled();
    expect(result).toEqual(mockSteamLibrary);
  });
  
  it("Should call API and cache result when not found in cache", async () => {
    mockRedisClient.getCachedKey.mockResolvedValue(null);
    mockAxiosRequest.mockResolvedValue(mockSteamLibrary);
    mockRedisClient.setCacheKeyAndValue.mockResolvedValue("OK");
  
    const result = await steamClientService.getUserGames("12345");
  
    expect(mockRedisClient.getCachedKey).toHaveBeenCalledWith("12345");
    expect(mockAxiosRequest).toHaveBeenCalled();
    expect(mockRedisClient.setCacheKeyAndValue).toHaveBeenCalled(); 
    expect(result).toEqual(mockSteamLibrary);
  });
});
