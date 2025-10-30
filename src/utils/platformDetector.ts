export const isTelegramWebApp = (): boolean => {
  return !!(window as any).Telegram?.WebApp;
};

export const getTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    return (window as any).Telegram.WebApp;
  }
  return null;
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return {
      id: tg.initDataUnsafe.user.id,
      firstName: tg.initDataUnsafe.user.first_name,
      lastName: tg.initDataUnsafe.user.last_name,
      username: tg.initDataUnsafe.user.username,
    };
  }
  return null;
};

export const getPlatform = (): 'telegram' | 'browser' => {
  return isTelegramWebApp() ? 'telegram' : 'browser';
};

export const canUseBrowserNotifications = (): boolean => {
  return !isTelegramWebApp() && 'Notification' in window;
};
