import classNames from 'classnames';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TabItem } from 'utils/sidebar-tabs';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import LogoutModal from 'routes/Logout';
import { logoutUser } from 'services/api';
import { TokenService } from 'services/tokenService';
import UserProfile from './UserProfile';

const MenuItem = ({ tab, level = 0, onSignOut }: { tab: TabItem; level?: number; onSignOut: () => void }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = tab.children && tab.children.length > 0;

  // Check if any child route is active
  const isChildActive = hasChildren && tab.children?.some(child => {
    // Exact match for child routes
    return location.pathname === child.route;
  });

  // Update isOpen state when a child becomes active
  useEffect(() => {
    if (isChildActive || location.pathname.startsWith(tab.route)) {
      setIsOpen(true);
    }
  }, [isChildActive, location.pathname, tab.route]);

  // For child items (level > 0), use exact matching
  // For parent items, check if current path matches exactly or if any child is active
  const isActive = level > 0 
    ? location.pathname === tab.route
    : tab.route === location.pathname || isChildActive;

  // Special handling for Sign Out
  if (tab.key === 'sign-out') {
    return (
      <div
        className={classNames(
          'flex items-center gap-2 hover:bg-gray-50 rounded-md p-1.5 text-sm cursor-pointer',
          isActive ? 'text-blue-500 font-medium bg-gray-100' : null,
          level > 0 ? 'ml-6' : ''
        )}
        onClick={onSignOut}
      >
        {tab.icon && <tab.icon className={classNames(
          'w-5 h-5',
          isActive ? 'text-blue-500' : 'text-black/80'
        )} />}
        <span>{tab.label}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={classNames(
          'flex items-center gap-2 hover:bg-gray-50 rounded-md p-1.5 text-sm cursor-pointer',
          (isActive) ? 'text-blue-500 font-medium bg-gray-100' : null,
          level > 0 ? 'ml-6' : ''
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <>
            <div className={classNames(
              'flex items-center gap-2 flex-1',
              isActive ? 'text-blue-500' : ''
            )}>
              {tab.icon && <tab.icon className={classNames(
                'w-5 h-5',
                isActive ? 'text-blue-500' : 'text-black/80'
              )} />}
              <span>{tab.label}</span>
            </div>
            {isOpen ? (
              <ChevronDownIcon className="w-4 h-4 text-black/60" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-black/60" />
            )}
          </>
        ) : (
          <NavLink
            to={tab.route}
            className={({ isActive: linkActive }) => classNames(
              'flex items-center gap-2 w-full',
              linkActive ? 'text-blue-500' : ''
            )}
            end={level > 0} // Use end prop for exact matching on child routes
          >
            {tab.icon && <tab.icon className={classNames(
              'w-5 h-5',
              isActive ? 'text-blue-500' : 'text-black/80'
            )} />}
            {tab.label}
          </NavLink>
        )}
      </div>
      {hasChildren && isOpen && tab.children && (
        <div className="mt-1">
          {tab.children.map(child => (
            <MenuItem key={child.key} tab={child} level={level + 1} onSignOut={onSignOut} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ tabs }: { tabs: TabItem[] }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setLogoutOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logoutUser();
    } catch (e) {}
    TokenService.removeToken();
    setLogoutOpen(false);
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-1 p-4 min-w-60 min-h-screen bg-white border-r border-gray-200">
      <NavLink to="/orders/get-orders" className="flex items-center gap-2 mb-4">
        <img className="h-8" src="https://quikapp.cc/lovable-uploads/4da932a7-a74d-4dd1-a1a0-1e93bc4da154.png" alt="City logo" />
        {/* <span className="text-sm font-bold">Rapid Logistics</span> */}
      </NavLink>
      
      {/* User Profile Section */}
      <UserProfile />
      
      {tabs.map(tab => (
        <MenuItem key={tab.key} tab={tab} onSignOut={handleSignOut} />
      ))}
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
