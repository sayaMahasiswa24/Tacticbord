import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Index from '../Pages/TacticalBoard/Index';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
  usePage: vi.fn(() => ({
    props: {
      features: {
        aiAssistant: false,
      },
    },
  })),
  router: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TacticalBoard Component & AI Feature Flag Isolation', () => {
  it('renders tactical pitch without crashing', () => {
    const { container } = render(<Index />);
    expect(container.querySelector('.app-container')).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('isolates and hides AI Assistant when features.aiAssistant is false', () => {
    render(<Index />);
    // AI Chat modal must not be in the DOM
    expect(screen.queryByText(/Asisten Taktik AI/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Tanya AI seputar formasi/i)).not.toBeInTheDocument();
  });

  it('renders AI Assistant entry point when features.aiAssistant is enabled', async () => {
    const { usePage } = await import('@inertiajs/react');
    usePage.mockReturnValue({
      props: {
        features: {
          aiAssistant: true,
        },
      },
    });

    render(<Index />);
    // Settings button with AI chatbot menu item is present
    expect(screen.getByLabelText(/Menu pengaturan/i)).toBeInTheDocument();
  });
});
