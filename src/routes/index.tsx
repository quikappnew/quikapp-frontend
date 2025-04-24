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
import Vehicle from './Vehicle';
import VehicleDetails from './Vehicle/vehicleDetails';
import Dashboard from './Dashboard';
import Locations from './Locations';
import Trips from './Trips';
import ViewTrip from './Trips/ViewTrip';
import Reports from './Reports';
import DriverPaymentRequests from './DriverPaymentRequests';
import AccountsPayable from './AccountsPayable';
import Vendor from './Vendor';
import VendorOnboarding from './Vendor/vendorOnBoardingForm';
import Client from './Client';
import Drivers from './Drivers';
import AdministrationUsers from './Users';
import VendorOnBoardingForm from './Vendor/vendorOnBoardingForm';
import Lock from './Lock';
import VendorOnBoardingList from './Vendor/vendorOnBoardingList';
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
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/locations',
      element: (
        <ProtectedRoute>
          <Locations />
        </ProtectedRoute>
      ),
    },
    {
      path: '/trips',
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Trips />
            </ProtectedRoute>
          ),
        },
        {
          path: ':tripId/view',
          element: (
            <ProtectedRoute>
              <ViewTrip />
            </ProtectedRoute>
          ),
        },
      ],
    },
    // {
    //   path: '/reports',
    //   element: (
    //     <ProtectedRoute>
    //       <Reports />
    //     </ProtectedRoute>
    //   ),
    // },
    // {
    //   path: '/driver-payment-requests',
    //   element: (
    //     <ProtectedRoute>
    //       <DriverPaymentRequests />
    //     </ProtectedRoute>
    //   ),
    // },
    // {
    //   path: '/accounts-payable',
    //   element: (
    //     <ProtectedRoute>
    //       <AccountsPayable />
    //     </ProtectedRoute>
    //   ),
    // },
    {
      path: '/vendor',
      children: [
        {
          path: 'onboarding',
          element: (
            <ProtectedRoute>
              <VendorOnBoardingForm />
            </ProtectedRoute>
          ),
        },
        {
          path: 'list',
          element: (
            <ProtectedRoute>
              <Vendor />
            </ProtectedRoute>
          ),
        },
        {
          path: 'onboarding-list',
          element: (
            <ProtectedRoute>
              <VendorOnBoardingList />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '/client',
      element: (
        <ProtectedRoute>
          <Client />
        </ProtectedRoute>
      ),
    },
    {
      path: '/drivers',
      element: (
        <ProtectedRoute>
          <Drivers />
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
          ],
        },
      ],
    },
    {
      path: '/vehicle',
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Vehicle />
            </ProtectedRoute>
          ),
        },
        {
          path: ':vehicleId',
          element: (
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: '/lock',
      element:(
        <ProtectedRoute>
             <Lock />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
