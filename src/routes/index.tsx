import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import CreateUserPage from './CreateUser';
import IdentityCard from './IdentityCard';
import IdentityCardInformation from './IdentityCard/Information';
import ScanAuditLogPage from './IdentityCard/ScanLogs';
import IdentityCardPublic from './IdentityCardPublic';
import Login from './Login';
import PrintSession from './PrintSession';
import RouteNotFound from './RouteNotFound';
import Settings from './Settings';
import User from './User';
import UserActivity from './User/Activity';
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
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
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
    // {
    //   path: '/identities/:identityCardId',
    //   element: <IdentityCardPublic />,
    // },
    // {
    //   path: '/identity-cards',
    //   children: [
    //     {
    //       path: ':identityCardId',
    //       element: (
    //         <ProtectedRoute>
    //           <IdentityCard />
    //         </ProtectedRoute>
    //       ),
    //       children: [
    //         {
    //           index: true,
    //           element: (
    //             <ProtectedRoute>
    //               <IdentityCardInformation />
    //             </ProtectedRoute>
    //           ),
    //         },
    //         {
    //           path: 'scan-logs',
    //           element: (
    //             <ProtectedRoute>
    //               <ScanAuditLogPage />
    //             </ProtectedRoute>
    //           ),
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ),
    },
    // {
    //   path: '/print-sessions/:printSessionId',
    //   element: (
    //     <ProtectedRoute>
    //       <PrintSession />
    //     </ProtectedRoute>
    //   ),
    // },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
