// src/services/tokenService.ts
export class TokenService {
    private static readonly TOKEN_KEY = 'auth_token';
  
    static setToken(token: string): void {
      try {
        // Store in both localStorage and sessionStorage for redundancy
        // localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.TOKEN_KEY, token);
      } catch (error) {
        console.error('Error storing token:', error);
      }
    }
  
    static getToken(): string | null {
      try {
        // Try sessionStorage first, then localStorage
        const token = sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
        return token;
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
      }
    }
  
    static removeToken(): void {
      // localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  
    static isAuthenticated(): boolean {
      return !!this.getToken();
    }
  }