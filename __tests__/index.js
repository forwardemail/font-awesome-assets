import m from '../src';

describe('svg', () => {
  it('should return a svg', () => {
    const black = m.svg('hacker-news');
    expect(black).toMatchSnapshot();
  });

  it('should return a red svg', () => {
    const red = m.svg('hacker-news', 'red');
    expect(red).toMatchSnapshot();
  });

  it('should return 2 different svg', () => {
    const black = m.svg('hacker-news');
    const red = m.svg('hacker-news', 'red');
    expect(black).not.toEqual(red);
  });

  it('should return a small svg', () => {
    const el = m.svg('hacker-news', '#0000bb', '50%', '50%');
    expect(el).toMatchSnapshot();
  });

  it('should allow optional "fa-" prefix in the name', () => {
    const el1 = m.svg('hacker-news');
    const el2 = m.svg('fa-hacker-news');
    expect(el1).toEqual(el2);
  });

  it('should throw a `name` error', () => {
    expect(() => m.svg([])).toThrowError('fa.svg `name` must be a String');
  });

  it('should throw a `color` error', () => {
    expect(() => m.svg('hacker-news', [])).toThrowError('fa.svg `color` must be a String');
  });

  it('should throw an invalid font error', () => {
    expect(() => m.svg('THIS_IS_INVALID'))
      .toThrowError('fa.svg name "this_is_invalid" must be a valid FontAwesome icon name');
  });
});
