import { ProxyService } from './proxy.service';
import axios from 'axios';

jest.mock('axios'); // Mock Axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProxyService', () => {
  let proxyService: ProxyService;

  beforeEach(() => {
    proxyService = new ProxyService();
  });

  it('should make a successful GET request through proxy', async () => {
    const mockResponse = { data: { success: true } }; // Include 'data' property
    mockedAxios.request.mockResolvedValueOnce(mockResponse);

    const result = await proxyService.makeRequest(
      'http://localhost:3000/users/get-user-by-id?id=1',
      'GET',
    );

    expect(result).toEqual({ success: true }); // Assert response
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://localhost:3000/users/get-user-by-id?id=1',
        method: 'GET',
        proxy: {
          host: '45.196.48.9',
          port: 5435,
          auth: { username: 'jtzhwqur', password: 'jnf0t0n2tecg' },
        },
      }),
    );
  });

  it('should throw an error if the request fails', async () => {
    mockedAxios.request.mockRejectedValueOnce(new Error('Network Error'));

    await expect(
      proxyService.makeRequest(
        'http://localhost:3000/users/get-user-by-id?id=1',
        'GET',
      ),
    ).rejects.toThrow('Network Error'); // Correctly test for the error message
  });
});
