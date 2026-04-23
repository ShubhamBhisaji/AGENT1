import { render, screen, fireEvent } from '@testing-library/react';
import ChatPage from '../app/page';

import { vi, describe, it, expect } from 'vitest';

// Mock the Editor component to prevent errors during rendering in jsdom
vi.mock('@monaco-editor/react', () => {
  return {
    default: function DummyEditor() {
      return <div data-testid="monaco-editor" />;
    }
  };
});

describe('ChatPage', () => {
  it('renders the chat interface', () => {
    render(<ChatPage />);
    expect(screen.getByText(/DEV-AI ORCHESTRA/i)).toBeInTheDocument();
  });
});
