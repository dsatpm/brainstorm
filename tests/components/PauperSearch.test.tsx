import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PauperSearch from '../../components/PauperSearch';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PauperSearch', () => {
  it('renders input and search button', () => {
    render(<PauperSearch />);
    expect(screen.getByPlaceholderText(/Search for any Pauper-legal card/i)).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('fetches and displays cards', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: [
      { id: '1', name: 'Lightning Bolt', image_uris: { normal: 'url' } }
    ] } });
    render(<PauperSearch />);
    fireEvent.change(screen.getByPlaceholderText(/Search for any Pauper-legal card/i), { target: { value: 'Lightning' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => expect(screen.getByText('Lightning Bolt')).toBeInTheDocument());
  });
});
