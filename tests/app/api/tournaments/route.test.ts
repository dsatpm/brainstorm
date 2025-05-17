import { GET } from '../../../../app/api/tournaments/route';

describe('/api/tournaments GET', () => {
  it('returns a list of tournaments', async () => {
    // @ts-ignore
    const res = await GET(new Request('http://localhost/api/tournaments'));
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('date');
  });
});
