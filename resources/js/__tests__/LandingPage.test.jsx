import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingIndex from '../Pages/Landing/Index';

// Mock Inertia Link and Head components
vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
  Head: ({ title }) => <title>{title}</title>,
}));

describe('LandingPage (LandingIndex)', () => {
  it('renders hero headline matching Figma design', () => {
    render(<LandingIndex />);
    expect(screen.getByText(/Think Tactics\./i)).toBeInTheDocument();
    expect(screen.getByText(/Build Your Game\./i)).toBeInTheDocument();
  });

  it('renders primary CTA buttons linking to /board', () => {
    render(<LandingIndex />);
    const topTrialBtn = screen.getByRole('link', { name: /Open trial tactical board/i });
    expect(topTrialBtn).toBeInTheDocument();
    expect(topTrialBtn).toHaveAttribute('href', '/board');

    const heroCtaBtn = screen.getByRole('link', { name: /Start building tactics/i });
    expect(heroCtaBtn).toBeInTheDocument();
    expect(heroCtaBtn).toHaveAttribute('href', '/board');

    const bottomCtaBtn = screen.getByRole('link', { name: /Open TacticBoard/i });
    expect(bottomCtaBtn).toBeInTheDocument();
    expect(bottomCtaBtn).toHaveAttribute('href', '/board');
  });

  it('renders all 4 feature cards correctly', () => {
    render(<LandingIndex />);
    expect(screen.getByText(/Visual tactics board/i)).toBeInTheDocument();
    expect(screen.getByText(/Phases & formations/i)).toBeInTheDocument();
    expect(screen.getByText(/Scenario library/i)).toBeInTheDocument();
    expect(screen.getByText(/Coach-ready sharing/i)).toBeInTheDocument();
  });

  it('renders the 3 steps to match day', () => {
    render(<LandingIndex />);
    expect(screen.getByText(/Set your shape/i)).toBeInTheDocument();
    expect(screen.getByText(/Draw the movement/i)).toBeInTheDocument();
    expect(screen.getByText(/Save and share/i)).toBeInTheDocument();
  });

  it('renders PWA & offline section', () => {
    render(<LandingIndex />);
    expect(screen.getByText(/Your tactics, ready/i)).toBeInTheDocument();
    expect(screen.getByText(/Install from a supported browser/i)).toBeInTheDocument();
    expect(screen.getByText(/Responsive across desktop, tablet, and mobile/i)).toBeInTheDocument();
  });
});
