import { GET } from '../../../../app/api/news/route';

describe('/api/news GET', () => {
  it('returns a list of news items', async () => {
    // @ts-ignore
    const res = await GET(new Request('http://localhost/api/news'));
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
    expect(data[0]).toHaveProperty('link');
  });
});
