import { render, screen, fireEvent } from '@testing-library/react';
import { DeckList, Deck } from '../../components/deck-list';

describe('DeckList', () => {
  const decks: Deck[] = [
    { id: '1', name: 'Mono-Red Burn', description: 'Aggro deck' },
    { id: '2', name: 'Dimir Control', description: 'Control deck' },
  ];
  it('renders deck names and descriptions', () => {
    render(
      <DeckList decks={decks} onEdit={jest.fn()} onDelete={jest.fn()} onSelect={jest.fn()} />
    );
    expect(screen.getByText('Mono-Red Burn')).toBeInTheDocument();
    expect(screen.getByText('Aggro deck')).toBeInTheDocument();
    expect(screen.getByText('Dimir Control')).toBeInTheDocument();
  });

  it('calls onEdit, onDelete, onSelect', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onSelect = jest.fn();
    render(
      <DeckList decks={decks} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />
    );
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(onEdit).toHaveBeenCalledWith(decks[0]);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
    fireEvent.click(screen.getByText('Mono-Red Burn'));
    expect(onSelect).toHaveBeenCalledWith(decks[0]);
  });
});
