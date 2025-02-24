import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './ui/icon';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
    { name: 'Reports', href: '/reports', icon: 'file-text' },
    { name: 'Support', href: '/support', icon: 'message-circle' },
    { name: 'Integrations', href: '/integrations', icon: 'puzzle' },
    { name: 'Profile', href: '/profile', icon: 'user' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center space-x-2">
              <Icon name="check-circle" className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">EA</span>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.href
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};