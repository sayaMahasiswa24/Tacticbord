import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../components/layout/Header';

describe('Header Component', () => {
  it('hides AI Assistant entry point when aiAssistantEnabled is false', () => {
    render(<Header aiAssistantEnabled={false} curFId="433" />);
    expect(screen.queryByText(/Asisten Taktik AI/i)).not.toBeInTheDocument();
  });

  it('shows AI Assistant entry point when aiAssistantEnabled is true', () => {
    render(<Header aiAssistantEnabled={true} isSettingsOpen={true} curFId="433" />);
    expect(screen.getByText(/Asisten Taktik AI/i)).toBeInTheDocument();
  });
});
