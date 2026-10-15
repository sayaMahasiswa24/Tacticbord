import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AllModals from '../components/modals/AllModals';

describe('AllModals Component', () => {
  it('does not render AIChatModal when aiAssistantEnabled is false even if isAIChatOpen is true', () => {
    render(
      <AllModals
        aiAssistantEnabled={false}
        isAIChatOpen={true}
        setIsAIChatOpen={() => {}}
        chatHistory={[]}
        chatInput=""
        setChatInput={() => {}}
        chatBusy={false}
        sendChatMessage={() => {}}
      />
    );

    expect(screen.queryByText(/Asisten Taktik AI/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Tanya AI/i)).not.toBeInTheDocument();
  });

  it('renders AIChatModal when aiAssistantEnabled is true and isAIChatOpen is true', () => {
    render(
      <AllModals
        aiAssistantEnabled={true}
        isAIChatOpen={true}
        setIsAIChatOpen={() => {}}
        chatHistory={[]}
        chatInput=""
        setChatInput={() => {}}
        chatBusy={false}
        sendChatMessage={() => {}}
      />
    );

    expect(screen.getByText(/Asisten Taktik AI/i)).toBeInTheDocument();
  });
});
