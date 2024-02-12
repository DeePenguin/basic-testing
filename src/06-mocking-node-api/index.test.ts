import path from 'node:path';
import fs from 'node:fs';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';

const timeoutValue = 500;

describe('doStuffByTimeout', () => {
  let timeoutSpy: jest.SpyInstance;
  let callback: () => void;

  beforeEach(() => {
    timeoutSpy = jest.spyOn(global, 'setTimeout');
    callback = jest.fn();
  });
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    doStuffByTimeout(callback, timeoutValue);

    expect(timeoutSpy).toBeCalled();
    expect(timeoutSpy).toBeCalledTimes(1);
    expect(timeoutSpy).toBeCalledWith(callback, timeoutValue);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(callback, timeoutValue);

    expect(callback).not.toBeCalled();
    jest.advanceTimersToNextTimer();
    expect(callback).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  let intervalSpy: jest.SpyInstance;
  let callback: () => void;

  beforeEach(() => {
    intervalSpy = jest.spyOn(global, 'setInterval');
    callback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    doStuffByInterval(callback, timeoutValue);

    expect(intervalSpy).toBeCalled();
    expect(intervalSpy).toBeCalledTimes(1);
    expect(intervalSpy).toBeCalledWith(callback, timeoutValue);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(callback, timeoutValue);

    expect(callback).not.toBeCalled();

    for (const tick of [1, 2, 3, 4, 5]) {
      jest.advanceTimersToNextTimer();
      expect(callback).toBeCalledTimes(tick);
    }
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'file.txt';
  const fileContent = 'file content';
  let joinSpy: jest.SpyInstance;
  let readFileMock: jest.SpyInstance;
  let existsSyncMock: jest.SpyInstance;

  beforeEach(() => {
    joinSpy = jest.spyOn(path, 'join');
    existsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    readFileMock = jest.spyOn(fs.promises, 'readFile');
    readFileMock.mockResolvedValue(fileContent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalled();
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    existsSyncMock.mockReturnValueOnce(true);
    await expect(readFileAsynchronously(pathToFile)).resolves.toEqual(
      fileContent,
    );
  });
});
