import { render, screen, fireEvent } from '@testing-library/react';
import DeckBuilder from '../../app/deck-builder/page';

describe('DeckBuilder', () => {
  it('renders deck builder UI', () => {
    render(<DeckBuilder />);
    expect(screen.getByText('Deck Builder')).toBeInTheDocument();
    expect(screen.getByText('Available Cards')).toBeInTheDocument();
    expect(screen.getByText('Your Deck')).toBeInTheDocument();
  });
});
