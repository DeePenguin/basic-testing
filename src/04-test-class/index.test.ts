import _ from 'lodash';
import {
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  const initialBalance = 100;
  let mainAccount: BankAccount;
  let operationAmount: number;
  let additionalAccount: BankAccount;

  beforeEach(() => {
    mainAccount = getBankAccount(initialBalance);
    operationAmount = 10;
    additionalAccount = getBankAccount(initialBalance);
  });

  test('should create account with initial balance', () => {
    expect(mainAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    operationAmount = initialBalance + 1;
    expect(() => mainAccount.withdraw(operationAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    operationAmount = initialBalance + 1;
    expect(() =>
      mainAccount.transfer(operationAmount, additionalAccount),
    ).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() =>
      mainAccount.transfer(operationAmount, mainAccount),
    ).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(mainAccount.deposit(operationAmount).getBalance()).toEqual(
      initialBalance + operationAmount,
    );
  });

  test('should withdraw money', () => {
    expect(mainAccount.withdraw(operationAmount).getBalance()).toEqual(
      initialBalance - operationAmount,
    );
  });

  test('should transfer money', () => {
    mainAccount.transfer(operationAmount, additionalAccount);
    expect(mainAccount.getBalance()).toEqual(initialBalance - operationAmount);
    expect(additionalAccount.getBalance()).toEqual(
      initialBalance + operationAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = 500;
    jest.spyOn(_, 'random').mockReturnValueOnce(balance).mockReturnValueOnce(1);

    await expect(mainAccount.fetchBalance()).resolves.toBe(balance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = 500;
    jest.spyOn(mainAccount, 'fetchBalance').mockResolvedValue(balance);

    await mainAccount.synchronizeBalance();

    expect(mainAccount.getBalance()).toEqual(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(mainAccount, 'fetchBalance').mockResolvedValue(null);

    await expect(mainAccount.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
