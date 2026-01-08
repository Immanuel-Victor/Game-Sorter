export interface SteamLibraryApiResponse {
    response: {
        game_count: number
        games: GameInfo[]
    } | {}
}

export interface GameInfo {
    appid: string;
    name: string;
    playtime_2weeks?: string;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url?: string;
}