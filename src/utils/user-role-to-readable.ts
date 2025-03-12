export default function userRoleToReadable(role: string): {
  label: string;
  color: string;
} {
  switch (role) {
    case 'ADMIN':
      return {
        label: 'Admin',
        color: '#FB8C00',
      };
    case 'SUPER_ADMIN':
      return {
        label: 'Super Admin',
        color: '#FB8C00',
      };
    default:
      return {
        label: role,
        color: '#000',
      };
  }
}
