import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SteamClientService } from "../common/steam-client/steam-client.service";
import { SorterService } from "./sorter.service";

describe("Game Sorter Service", () => {
  let sorterService: SorterService;
  let mockSteamClientService: jest.Mocked<SteamClientService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSteamClientService = {
      getUserGames: jest.fn(),
    } as unknown as jest.Mocked<SteamClientService>;

    sorterService = new SorterService(mockSteamClientService);
  });

  describe("sortUserGames", () => {
    it("Should call Steam API and return a weighted random game", async () => {
      const userId = "123545123123123";
      const mockGames = [
        {
          appid: 111,
          name: "Never Played Game",
          playtime_forever: 0,
          img_icon_url: "icon1",
          has_community_visible_stats: true,
        },
        {
          appid: 222,
          name: "Played a Bit",
          playtime_forever: 15,
          img_icon_url: "icon2",
          has_community_visible_stats: true,
        },
        {
          appid: 333,
          name: "Played More",
          playtime_forever: 45,
          img_icon_url: "icon3",
          has_community_visible_stats: true,
        },
      ];

      mockSteamClientService.getUserGames.mockResolvedValue({
        response: { game_count: 3, games: mockGames },
      });

      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const result = await sorterService.sortUserGames(userId);

      expect(mockSteamClientService.getUserGames).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
      expect(result.weight).toBeDefined();
      expect(result.appid).toBe(111);
    });

    it("Should assign correct weights based on playtime", async () => {
      const userId = "123545123123123";
      const mockGames = [
        { appid: 1, name: "Game 1", playtime_forever: 0, img_icon_url: "icon1", has_community_visible_stats: true },
        { appid: 2, name: "Game 2", playtime_forever: 15, img_icon_url: "icon2", has_community_visible_stats: true },
        { appid: 3, name: "Game 3", playtime_forever: 45, img_icon_url: "icon3", has_community_visible_stats: true },
      ];

      mockSteamClientService.getUserGames.mockResolvedValue({
        response: { game_count: 3, games: mockGames },
      });

      jest.spyOn(Math, "random").mockReturnValue(0);

      const result = await sorterService.sortUserGames(userId);

      expect(result.weight).toBeGreaterThan(0);
    });

    it("Should filter games with more than 60 minutes playtime", async () => {
      const userId = "123545123123123";
      const mockGames = [
        { appid: 1, name: "Short Game", playtime_forever: 30, img_icon_url: "", has_community_visible_stats: true },
        { appid: 2, name: "Long Game", playtime_forever: 120, img_icon_url: "", has_community_visible_stats: true },
      ];

      mockSteamClientService.getUserGames.mockResolvedValue({
        response: { game_count: 2, games: mockGames },
      });

      jest.spyOn(Math, "random").mockReturnValue(0);

      const result = await sorterService.sortUserGames(userId);
      
      expect(result.appid).toBe(1);
    });

    it("Should throw error when no games are found", async () => {
      const userId = "123545123123123";

      mockSteamClientService.getUserGames.mockResolvedValue({
        response: {},
      });

      await expect(sorterService.sortUserGames(userId)).rejects.toThrow(
        "No games found in user library"
      );
    });
  });
});
