import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, FileText, CreditCard, Settings, DollarSign, ChevronRight, ChevronDown } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    if (expanded === key) {
      setExpanded(null);
    } else {
      setExpanded(key);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={18} />,
      path: '/',
    },
    {
      key: 'transactions',
      label: 'Transactions',
      icon: <CreditCard size={18} />,
      path: '/transactions',
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: <PieChart size={18} />,
      path: '/reports',
      submenu: [
        { label: 'Income Report', path: '/reports/income' },
        { label: 'Expense Report', path: '/reports/expense' },
        { label: 'Category Summary', path: '/reports/categories' },
      ],
    },
    {
      key: 'budgets',
      label: 'Budgets',
      icon: <DollarSign size={18} />,
      path: '/budgets',
    },
    {
      key: 'statements',
      label: 'Statements',
      icon: <FileText size={18} />,
      path: '/statements',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />,
      path: '/settings',
    },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-md flex-shrink-0 hidden lg:block">
      <div className="p-6">
        <div className="flex items-center">
          <DollarSign className="text-primary-500 h-8 w-8" />
          <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FinTrackr</h1>
        </div>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.key} className="mb-1">
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.key)}
                    className={`flex items-center justify-between w-full px-6 py-3 text-left text-sm font-medium ${
                      location.pathname.startsWith(item.path)
                        ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    } transition-colors duration-150`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {expanded === item.key ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                  {expanded === item.key && (
                    <ul className="pl-12 py-1 bg-gray-50 dark:bg-gray-900">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={`block py-2 px-4 text-sm ${
                              location.pathname === subItem.path
                                ? 'text-primary-500 font-medium'
                                : 'text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400'
                            } transition-colors duration-150`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  } transition-colors duration-150`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};