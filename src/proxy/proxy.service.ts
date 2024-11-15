import axios, { AxiosRequestConfig } from 'axios';

export class ProxyService {
  private readonly proxyConfig: AxiosRequestConfig = {
    proxy: {
      host: '45.196.48.9',
      port: 5435,
      auth: {
        username: 'jtzhwqur',
        password: 'jnf0t0n2tecg',
      },
    },
  };

  async makeRequest(
    url: string,
    method: 'GET' | 'POST',
    data?: any,
  ): Promise<any> {
    try {
      const response = await axios({
        url,
        method,
        data,
        ...this.proxyConfig,
      });
      return response.data;
    } catch (error) {
      console.error('Error making request through proxy:', error);
      throw error;
    }
  }
}
