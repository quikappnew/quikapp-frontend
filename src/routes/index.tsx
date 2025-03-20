import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import CreateUserPage from './CreateUser';
import Login from './Login';
import RouteNotFound from './RouteNotFound';
import Settings from './Settings';
import User from './User';
import UserDocuments from './User/Documents';
import UserCards from './User/IdentityCards';
import UserInformation from './User/Information';
import AdministrationUsers from './Users';

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '*',
      element: <RouteNotFound />,
    },
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <AdministrationUsers />
        </ProtectedRoute>
      ),
    },
    {
      path: '/create-user',
      element: <CreateUserPage />,
    },
    {
      path: '/users',
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdministrationUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: ':userId',
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute>
                  <UserInformation />
                </ProtectedRoute>
              ),
            },
            {
              path: 'documents',
              element: (
                <ProtectedRoute>
                  <UserDocuments />
                </ProtectedRoute>
              ),
            },
            {
              path: 'identity-cards',
              element: (
                <ProtectedRoute>
                  <UserCards />
                </ProtectedRoute>
              ),
            },
            // {
            //   path: 'activity',
            //   element: (
            //     <ProtectedRoute>
            //       <UserActivity />
            //     </ProtectedRoute>
            //   ),
            // },
          ],
        },
      ],
    },
    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ),
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
