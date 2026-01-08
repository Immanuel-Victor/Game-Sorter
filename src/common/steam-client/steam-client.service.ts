import { AxiosClient } from "../axios-client/axios-client";
import { RedisClient } from "../redis/redis-client";
import { SteamLibraryApiResponse } from "./steam-api.interface";

export class SteamClientService {
    private steamBaseUrl: string;
    private steamClientKey: string;
    constructor(private readonly redisClient: RedisClient) {
        const baseUrl = process.env.STEAM_URL 
        if(!baseUrl) {
            throw new Error('Base url not set in env');
        }
        const clientKey = process.env.STEAM_CLIENT_KEY;
        if(!clientKey) {
            throw new Error('Steam client key not set in env');
        }
        this.steamBaseUrl = baseUrl;
        this.steamClientKey = clientKey;
    }

    async getUserGames(steamUserId: string): Promise<SteamLibraryApiResponse> {
        const options = {
            steamid: steamUserId,
            format: 'json',
            key: this.steamClientKey,
            include_appinfo: true,
        }
        const url = `${this.steamBaseUrl}/IPlayerService/GetOwnedGames/v0001/`
        const foundInCache = await this.redisClient.getCachedKey(steamUserId);
        if(foundInCache) {
            return JSON.parse(foundInCache);
        }

        const responseData = await AxiosClient.request<SteamLibraryApiResponse>(url, 'get', options);

        await this.redisClient.setCacheKeyAndValue(steamUserId, JSON.stringify(responseData))
        
        return responseData;
    }
}