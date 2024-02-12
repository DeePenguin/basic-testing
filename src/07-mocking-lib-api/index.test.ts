import axios, { Axios } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash/throttle', () => ({
  default: jest.fn((fn) => fn),
  __esModule: true,
}));

describe('throttledGetDataFromApi', () => {
  const responseData = { foo: 'bar' };
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const relativePath = '/endpoint';

  let createSpy: jest.SpyInstance;
  let getSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    jest.advanceTimersToNextTimer();
    createSpy = jest.spyOn(axios, 'create');
    getSpy = jest.spyOn(Axios.prototype, 'get');
    getSpy.mockResolvedValue({ data: responseData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(createSpy).toBeCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);
    expect(getSpy).toBeCalledWith(relativePath);
  });

  test('should return response data', async () => {
    expect(throttledGetDataFromApi(relativePath)).resolves.toEqual(
      responseData,
    );
  });
});
