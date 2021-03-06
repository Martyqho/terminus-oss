import { stripControlCharacters } from '@terminus/ui-utilities';

describe(`stripControlCharacters`, function() {
  const specialString = `\thttps://www.google.com\r`;

  test(`should remove control characters from a string`, () => {
    expect(stripControlCharacters(specialString)).toEqual(`https://www.google.com`);
  });
});
