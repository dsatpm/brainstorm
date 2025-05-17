import { render, screen, fireEvent } from '@testing-library/react';
import { DeckForm } from '../../components/deck-form';

describe('DeckForm', () => {
  it('renders form fields and submits', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<DeckForm onSubmit={onSubmit} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText(/Deck Name/i), { target: { value: 'Test Deck' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Desc' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Test Deck', description: 'Desc' });
  });

  it('calls onCancel', () => {
    const onCancel = jest.fn();
    render(<DeckForm onSubmit={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });
});
