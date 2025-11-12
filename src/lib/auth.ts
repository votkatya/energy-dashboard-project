const AUTH_API = 'https://functions.poehali.dev/6ab3bea8-8d31-4166-b350-5a4b55a8acc7';
const ENTRIES_API = 'https://functions.poehali.dev/2d4b8a75-8e94-40d2-8412-5e0040b74b86';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = JSON.parse(storedUser);
    }
  }

  async register(email: string, password: string, name: string, telegramChatId?: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        name,
        telegram_chat_id: telegramChatId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка входа');
    }

    const data: AuthResponse = await response.json();
    this.setAuth(data.token, data.user);
    return data;
  }

  async verifyToken(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(AUTH_API, {
        method: 'GET',
        headers: {
          'X-Auth-Token': this.token,
        },
      });

      if (!response.ok) {
        this.clearAuth();
        return null;
      }

      const data = await response.json();
      this.user = data.user;
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data.user;
    } catch {
      this.clearAuth();
      return null;
    }
  }

  logout(): void {
    this.clearAuth();
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  private setAuth(token: string, user: User): void {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export const authService = new AuthService();
export { AUTH_API, ENTRIES_API };