import { User } from 'types/api';
import Cookies from 'js-cookie';

export const isAuthenticated = () => !!Cookies.get('token');

export const storeLoginCredentials = (user: User, tokenId: string) => {
  Cookies.set('token', tokenId, { expires: 365 });
  Cookies.set('user', JSON.stringify(user), { expires: 365 });
};

export const getToken = () => Cookies.get('token') || '';
export const getUser = (): User | null => {
  const userStr = Cookies.get('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  refresh();
};

export const getUserRole = () => {
  const user = getUser();
  if (user?.role) {
    return user.role;
  }
  return 'USER';
};

const refresh = () => window.location.reload();
