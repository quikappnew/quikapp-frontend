import { UserType } from '__generated__/graphql';
import Cookies from 'js-cookie';

export const isAuthenticated = () => !!Cookies.get('token');

export const storeLoginCredentials = (user: UserType, tokenId: string) => {
  Cookies.set('token', tokenId, { expires: 365 });
  Cookies.set('user', JSON.stringify(user), { expires: 365 });
};

export const getToken = () => (Cookies.get('token') ? Cookies.get('token') : '');
export const getUser = () => (Cookies.get('user') ? JSON.parse(Cookies.get('user')) : '');

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  refresh();
};

export const getUserRole = () => {
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  if (user && user.role) {
    return user.role;
  }
  return 'USER';
};

const refresh = () => window.location.reload();
