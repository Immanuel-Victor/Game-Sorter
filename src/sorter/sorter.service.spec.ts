import { beforeEach, describe, it, jest } from "@jest/globals";
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

  it("Should sort user games", () => {})
});
