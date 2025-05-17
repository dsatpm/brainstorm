import { GET } from '../../../../app/api/decks/route';

describe('/api/decks GET', () => {
  it('returns a list of decks', async () => {
    // @ts-ignore
    const res = await GET(new Request('http://localhost/api/decks'));
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
  });
});
