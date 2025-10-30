import funcUrls from '../../backend/func2url.json';

let schedulerInterval: number | null = null;

export const startNotificationScheduler = () => {
  if (schedulerInterval) {
    return;
  }

  const checkNotifications = async () => {
    try {
      await fetch(funcUrls['check-notifications']);
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  checkNotifications();

  schedulerInterval = window.setInterval(() => {
    checkNotifications();
  }, 60000);
};

export const stopNotificationScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
};
