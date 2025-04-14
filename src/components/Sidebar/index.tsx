import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import rapidLogo from 'media/rapid-logo.png';
import { TabItem } from 'utils/sidebar-tabs';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MenuItem = ({ tab, level = 0 }: { tab: TabItem; level?: number }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = tab.children && tab.children.length > 0;

  const isActive = tab.exact
    ? location.pathname === tab.route
    : location.pathname === tab.route ||
      (location.pathname.startsWith(tab.route) && tab.route !== '/');

  return (
    <div className="w-full">
      <div
        className={classNames(
          'flex items-center gap-2 hover:bg-gray-50 rounded-md p-1.5 text-sm cursor-pointer',
          isActive ? 'text-blue-500 font-medium bg-gray-100' : null,
          level > 0 ? 'ml-6' : ''
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <>
            <div className="flex items-center gap-2 flex-1">
              {tab.icon && <tab.icon className="w-5 h-5" />}
              <span>{tab.label}</span>
            </div>
            {isOpen ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </>
        ) : (
          <NavLink
            to={tab.route}
            className="flex items-center gap-2 w-full"
          >
            {tab.icon && <tab.icon className="w-5 h-5 text-black/80" />}
            {tab.label}
          </NavLink>
        )}
      </div>
      {hasChildren && isOpen && tab.children && (
        <div className="mt-1">
          {tab.children.map(child => (
            <MenuItem key={child.key} tab={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ tabs }: { tabs: TabItem[] }) {
  return (
    <div className="flex flex-col gap-1 p-4 min-w-60 min-h-screen bg-white border-r border-gray-200">
      <NavLink to="/" className="flex items-center gap-2 mb-4">
        <img className="h-8" src={rapidLogo} alt="City logo" />
        <span className="text-sm font-bold">Rapid Logistics</span>
      </NavLink>
      {tabs.map(tab => (
        <MenuItem key={tab.key} tab={tab} />
      ))}
    </div>
  );
}
