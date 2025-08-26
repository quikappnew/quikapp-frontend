# User Management System

## Overview

This is a comprehensive user management system that provides complete CRUD operations for user management. The system is designed to be accessible only by Super Users (role ID: 1) and includes all the required API endpoints as specified.

## Features

### 🔐 Access Control

- **Super User Only**: All user management operations require Super User privileges (role ID: 1)
- **Automatic Redirect**: Non-super users are automatically redirected to the dashboard
- **Route Protection**: Protected routes with proper authentication checks

### 👥 User Management Operations

#### 1. Create User (`POST /api/users/create_user/`)

- Create new users with full details
- Password validation and security
- Role assignment
- Active/inactive status control

#### 2. Get User (`POST /api/users/get_user/`)

- Retrieve user details by ID
- Complete user profile information

#### 3. Update User (`POST /api/users/update_user/`)

- Update user information
- Modify role, status, and personal details
- Partial updates supported

#### 4. List Users (`POST /api/users/list_users/`)

- Paginated user listing
- Advanced filtering options:
  - Search by name, email, phone
  - Filter by role
  - Filter by active status
  - Date range filtering
- Sorting and pagination

#### 5. Delete User (`POST /api/users/delete_user/`)

- Soft delete user accounts
- Confirmation dialogs for safety

#### 6. Get Roles (`POST /api/users/get_roles/`)

- Retrieve all available user roles
- Role descriptions and permissions

#### 7. Update User Role (`POST /api/users/update_user_role/`)

- Change user roles
- Role validation and security

#### 8. Change Password (`POST /api/users/change_password/`)

- Admin password reset functionality
- Secure password change process

## API Endpoints

### Base URL

```
POST /api/users/
```

### Available Endpoints

| Endpoint             | Method | Description             | Access     |
| -------------------- | ------ | ----------------------- | ---------- |
| `/create_user/`      | POST   | Create new user         | Super User |
| `/get_user/`         | POST   | Get user by ID          | Super User |
| `/update_user/`      | POST   | Update user information | Super User |
| `/list_users/`       | POST   | List users with filters | Super User |
| `/delete_user/`      | POST   | Delete user             | Super User |
| `/get_roles/`        | POST   | Get all available roles | Super User |
| `/update_user_role/` | POST   | Update user role        | Super User |
| `/change_password/`  | POST   | Change user password    | Super User |

## User Interface

### Main Features

#### 📋 User List

- **Responsive Table**: Clean, modern table design
- **Pagination**: Configurable page sizes (5, 10, 25, 50)
- **Search**: Real-time search across user data
- **Filters**: Role and status filtering
- **Sorting**: Click column headers to sort

#### ➕ Create User

- **Form Validation**: Client-side validation
- **Password Security**: Show/hide password toggle
- **Role Selection**: Dropdown with all available roles
- **Status Control**: Active/inactive toggle

#### ✏️ Edit User

- **Pre-filled Forms**: Auto-populated with current data
- **Partial Updates**: Update only changed fields
- **Role Management**: Change user roles
- **Status Toggle**: Activate/deactivate users

#### 🔐 Password Management

- **Secure Input**: Password fields with show/hide
- **Confirmation**: Password confirmation required
- **Validation**: Minimum 6 characters required

#### 🗑️ Delete User

- **Confirmation Dialog**: Prevents accidental deletion
- **User Information**: Shows user details before deletion

### UI Components

#### Navigation

- **Sidebar Menu**: User Management section in sidebar
- **Breadcrumbs**: Clear navigation path
- **Access Control**: Menu items hidden for non-super users

#### Data Display

- **Status Chips**: Color-coded status indicators
- **Role Badges**: Visual role representation
- **Action Buttons**: Intuitive action icons
- **Loading States**: Progress indicators

## File Structure

```
src/
├── routes/
│   └── Users/
│       ├── UserManagement.tsx          # Main user management component
│       ├── UserManagementRoute.tsx     # Route wrapper with layout
│       └── index.tsx                   # Existing users list
├── services/
│   └── api.ts                          # API functions (updated)
└── utils/
    └── sidebar-tabs.ts                 # Sidebar configuration (updated)
```

## Implementation Details

### API Integration

The system uses the following API functions from `src/services/api.ts`:

```typescript
// User Management API Functions
export const createUserManagement = async (data: CreateUserRequest)
export const getUserManagement = async (data: GetUserRequest)
export const updateUserManagement = async (data: UpdateUserRequest)
export const listUsersManagement = async (data: ListUsersRequest)
export const deleteUserManagement = async (data: DeleteUserRequest)
export const getRolesManagement = async ()
export const updateUserRoleManagement = async (data: UpdateUserRoleRequest)
export const changePasswordManagement = async (data: ChangePasswordRequest)

// Helper Functions
export const isSuperUser = (): boolean
export const requireSuperUser = (): void
```

### Type Definitions

```typescript
interface UserManagementUser {
  id: string;
  phone_number: string;
  full_name: string;
  email: string;
  role: number;
  role_display: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateUserRequest {
  phone_number: string;
  full_name: string;
  email: string;
  role: number;
  password: string;
  is_active?: boolean;
}
```

### State Management

The component uses React hooks for state management:

- **User Data**: Users list, roles, pagination
- **Modal States**: Create, edit, delete, role, password modals
- **Form States**: Form data and validation errors
- **UI States**: Loading, error states, visibility toggles

## Security Features

### Access Control

- **Role-based Access**: Only Super Users can access
- **Route Protection**: Automatic redirect for unauthorized users
- **API Protection**: Server-side role validation

### Data Validation

- **Client-side Validation**: Form validation before submission
- **Server-side Validation**: API-level validation
- **Password Security**: Minimum length and confirmation

### Error Handling

- **Graceful Errors**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Loading States**: Visual feedback during operations

## Usage

### Accessing User Management

1. **Login as Super User**: Ensure you have Super User privileges (role ID: 1)
2. **Navigate to User Management**:
   - Go to `/users/management` directly, or
   - Use the sidebar menu: User Management → User Management
3. **Perform Operations**: Use the interface to manage users

### Creating a User

1. Click "Create User" button
2. Fill in required fields:
   - Phone Number
   - Full Name
   - Email
   - Role (select from dropdown)
   - Password (minimum 6 characters)
3. Toggle "Active" status if needed
4. Click "Create User"

### Editing a User

1. Click the edit icon (pencil) next to a user
2. Modify the desired fields
3. Click "Update User"

### Changing User Role

1. Click the security icon next to a user
2. Select new role from dropdown
3. Click "Update Role"

### Changing Password

1. Click the lock icon next to a user
2. Enter new password and confirmation
3. Click "Change Password"

### Deleting a User

1. Click the delete icon (trash) next to a user
2. Confirm deletion in the dialog
3. Click "Delete"

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Connection issues and timeouts
- **Validation Errors**: Form validation and API validation
- **Permission Errors**: Access denied for non-super users
- **Server Errors**: Backend errors and exceptions

All errors are displayed as toast notifications with appropriate messages.

## Future Enhancements

Potential improvements for the user management system:

1. **Bulk Operations**: Select multiple users for bulk actions
2. **Advanced Filters**: More filtering options (date ranges, etc.)
3. **Export Functionality**: Export user data to CSV/Excel
4. **Audit Logs**: Track user management actions
5. **User Activity**: View user login history and activity
6. **Two-Factor Authentication**: Enhanced security features
7. **User Groups**: Group-based permissions and management

## Troubleshooting

### Common Issues

1. **Access Denied**: Ensure you're logged in as a Super User
2. **API Errors**: Check network connection and server status
3. **Form Validation**: Ensure all required fields are filled
4. **Password Issues**: Password must be at least 6 characters

### Debug Information

- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Confirm user role in localStorage
- Check network tab for API request/response details

## Support

For issues or questions regarding the user management system:

1. Check this documentation
2. Review the code comments
3. Test with different user roles
4. Verify API endpoint availability
5. Check browser console for errors
