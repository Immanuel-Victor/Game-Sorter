import axios, { Method } from "axios";

export class AxiosClient {
  static async request<T>(
    url: string,
    method: Method,
    params: any
  ): Promise<T> {
    try {
      const result = await axios.request<T>({
        baseURL: url,
        method,
        params: {
          ...params,
        },
      });

        return result.data;
    } catch (error: unknown) {
        console.log(error);
        throw new Error('Error in axios request: ')
    }
  }
}
