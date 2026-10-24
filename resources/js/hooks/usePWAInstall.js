import { useState, useEffect, useCallback } from 'react';

export function usePWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
    const [showInstallGuide, setShowInstallGuide] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check standalone / installed status
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone) {
            setIsInstalled(true);
        }

        // Detect iOS
        const ua = window.navigator.userAgent.toLowerCase();
        const isAppleMobile = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
        setIsIOS(isAppleMobile);

        // Track online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Capture PWA install prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Capture successful app installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            setShowInstallGuide(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (isInstalled) {
            return { outcome: 'already-installed' };
        }

        if (deferredPrompt) {
            try {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    setIsInstalled(true);
                    setIsInstallable(false);
                }
                setDeferredPrompt(null);
                return { outcome: choiceResult.outcome };
            } catch (err) {
                console.warn('[PWA] Prompt error:', err);
                setShowInstallGuide(true);
                return { outcome: 'error' };
            }
        }

        // If native prompt is not available, show the step-by-step install modal
        setShowInstallGuide(true);
        return { outcome: isIOS ? 'ios-guide' : 'manual-guide' };
    }, [deferredPrompt, isInstalled, isIOS]);

    return {
        isInstallable,
        isInstalled,
        isIOS,
        isOnline,
        showInstallGuide,
        setShowInstallGuide,
        promptInstall,
    };
}
