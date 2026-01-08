import { GameInfo } from "../common/steam-client/steam-api.interface";
import { SteamClientService } from "../common/steam-client/steam-client.service";

export class SorterService {
  private steamClientService: SteamClientService;
  private weights = {
    neverPlayed: 0.75,
    playedForLessThanTwentyMinutes: 0.2,
    playedForMoreThanTwentyMinutes: 0.05,
  };
  constructor(steamClientService: SteamClientService) {
    this.steamClientService = steamClientService;
  }

  async sortUserGames(userId: string): Promise<WeightedGame> {
    const libraryGames = await this.steamClientService.getUserGames(userId);

    if (!libraryGames.response || !("games" in libraryGames.response)) {
      throw new Error("No games found in user library");
    }

    const lessPlayedGames = this.filterGamesWithLessThanAnHour(
      libraryGames.response.games
    );

    const weightedGames = this.assignWeightToGames(lessPlayedGames);

    return this.chooseRandomGameFromList(weightedGames);
  }

  private chooseRandomGameFromList(gameList: WeightedGame[]): WeightedGame {
    const totalWeight = gameList.reduce((sum, game) => sum + game.weight, 0);
    let random = Math.random() * totalWeight;

    for (const game of gameList) {
      random -= game.weight;
      if (random <= 0) {
        return game;
      }
    }

    return gameList[gameList.length - 1]!;
  }

  private assignWeightToGames(gameList: GameInfo[]): WeightedGame[] {
    return gameList.map((game) => {
      let gameWeight = 0;
      if (game.playtime_forever === 0) {
        gameWeight = this.weights.neverPlayed;
      } else if (game.playtime_forever < 20) {
        gameWeight = this.weights.playedForLessThanTwentyMinutes;
      } else {
        gameWeight = this.weights.playedForMoreThanTwentyMinutes;
      }

      return {
        ...game,
        weight: gameWeight,
      };
    });
  }

  private filterGamesWithLessThanAnHour(gameList: GameInfo[]): GameInfo[] {
    return gameList.filter((game) => game.playtime_forever < 60);
  }
}

interface WeightedGame extends GameInfo {
  weight: number;
}
