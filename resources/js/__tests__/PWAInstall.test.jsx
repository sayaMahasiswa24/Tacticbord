import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PWAInstallModal from '../components/modals/PWAInstallModal';
import Header from '../components/layout/Header';

describe('PWA Offline & Install Functionality', () => {
  it('renders PWAInstallModal with installation steps when open', () => {
    const handleInstall = vi.fn();
    render(
      <PWAInstallModal
        isOpen={true}
        onClose={() => {}}
        isInstalled={false}
        isIOS={false}
        isInstallable={true}
        onInstall={handleInstall}
      />
    );

    expect(screen.getByText(/Pasang TacticBoard/i)).toBeInTheDocument();
    expect(screen.getByText(/Aplikasi Offline \(Progressive Web App\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pasang Sekarang ke Perangkat/i })).toBeInTheDocument();

    const installBtn = screen.getByRole('button', { name: /Pasang Sekarang ke Perangkat/i });
    fireEvent.click(installBtn);
    expect(handleInstall).toHaveBeenCalled();
  });

  it('renders iOS specific instructions when isIOS is true', () => {
    render(
      <PWAInstallModal
        isOpen={true}
        onClose={() => {}}
        isInstalled={false}
        isIOS={true}
        isInstallable={false}
        onInstall={() => {}}
      />
    );

    expect(screen.getByText(/Panduan Pasang di iPhone \/ iPad \(Safari\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Tambah ke Layar Utama/i)).toBeInTheDocument();
  });

  it('shows success message when application is already installed', () => {
    render(
      <PWAInstallModal
        isOpen={true}
        onClose={() => {}}
        isInstalled={true}
        isIOS={false}
        isInstallable={false}
        onInstall={() => {}}
      />
    );

    expect(screen.getByText(/Aplikasi Sudah Terpasang!/i)).toBeInTheDocument();
  });

  it('renders install button in Header when onInstallClick is provided', () => {
    const onInstallClick = vi.fn();
    render(
      <Header
        curFId="433"
        changeFormation={() => {}}
        onInstallClick={onInstallClick}
        isInstalled={false}
        isOnline={true}
      />
    );

    const installBtn = screen.getByRole('button', { name: /Unduh App/i });
    expect(installBtn).toBeInTheDocument();
    fireEvent.click(installBtn);
    expect(onInstallClick).toHaveBeenCalled();
  });

  it('shows offline badge in Header when isOnline is false', () => {
    render(
      <Header
        curFId="433"
        changeFormation={() => {}}
        onInstallClick={() => {}}
        isInstalled={false}
        isOnline={false}
      />
    );

    expect(screen.getByText(/Offline/i)).toBeInTheDocument();
  });
});
