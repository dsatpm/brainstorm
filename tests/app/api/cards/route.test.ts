import { GET } from '../../../../app/api/cards/route';

describe('/api/cards GET', () => {
  it('returns Scryfall data', async () => {
    // @ts-ignore
    const res = await GET(new Request('http://localhost/api/cards?color=red&type=creature'));
    const data = await res.json();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
  });
});
