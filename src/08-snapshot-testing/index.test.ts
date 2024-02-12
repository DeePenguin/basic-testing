import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const values1 = [1, 2, 3];
  const values2 = [4, 5, 6];
  test('should generate linked list from values 1', () => {
    const expected = {
      next: {
        next: {
          next: {
            next: null,
            value: null,
          },
          value: 3,
        },
        value: 2,
      },
      value: 1,
    };

    const list = generateLinkedList(values1);
    expect(list).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const list = generateLinkedList(values2);
    expect(list).toMatchSnapshot('list');
  });
});
