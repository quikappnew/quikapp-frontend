import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import cityLogo from 'media/ncdc-logo.png';

interface TabItem {
  key: string;
  label: string;
  route: string;
  icon?: string;
  exact?: boolean;
}

export default function Sidebar({ tabs }: { tabs: TabItem[] }) {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-1 p-4 min-w-60 min-h-screen bg-white border-r border-gray-200">
      <NavLink to="/" className="flex items-center gap-2 mb-4">
        <img className="h-8" src={cityLogo} alt="City logo" />
        <span className="text-sm font-bold">City Permit System</span>
      </NavLink>
      {tabs.map(tab => (
        <NavLink
          key={tab.key}
          to={tab.route}
          className={classNames(
            'flex items-center gap-2 hover:bg-gray-50 rounded-md p-1.5 text-sm',
            tab.exact
              ? location.pathname === tab.route
                ? 'text-blue-500 font-medium bg-gray-100'
                : null
              : location.pathname === tab.route ||
                (location.pathname.startsWith(tab.route) && tab.route !== '/')
              ? 'text-blue-500 font-medium bg-gray-100'
              : null
          )}
        >
          {tab.icon && <img src={tab.icon} alt={tab.label} width={20} height={20} />}
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
