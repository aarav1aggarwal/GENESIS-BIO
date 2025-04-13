import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import ProgressBar from './ProgressBar';
import { 
  BookIcon, 
  ExploreIcon,
  SimulateIcon,
  BioCaseIcon,
  ChallengesIcon,
  ProfileIcon,
  MenuIcon
} from '@/lib/icons';

const navItems = [
  { 
    id: 'learn', 
    label: 'Learn', 
    icon: BookIcon, 
    badge: 'BioLearning XR' 
  },
  { 
    id: 'explore', 
    label: 'Explore', 
    icon: ExploreIcon, 
    badge: 'Tissue Vault' 
  },
  { 
    id: 'simulate', 
    label: 'Simulate', 
    icon: SimulateIcon, 
    badge: 'BioTwin AI' 
  },
  { 
    id: 'biocase', 
    label: 'BioCase Vault', 
    icon: BioCaseIcon, 
    badge: 'Real-Life Stories' 
  },
  { 
    id: 'challenges', 
    label: 'Challenges', 
    icon: ChallengesIcon, 
    badge: 'Games' 
  },
  { 
    id: 'profile', 
    label: 'Profile', 
    icon: ProfileIcon, 
    badge: 'Progress' 
  },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const currentSection = location === '/' ? 'learn' : location.slice(1);

  return (
    <aside className="bg-white shadow-md lg:w-64 w-full lg:fixed lg:h-full overflow-auto z-30">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-600">GENESIS BIO</h1>
            <p className="text-xs text-gray-500">Print Life. Shape Futures.</p>
          </div>
          <button 
            className="lg:hidden text-gray-500 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      
      <nav className={`p-2 ${mobileMenuOpen ? '' : 'hidden lg:block'}`} id="sidebar-menu">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-1">
              <Link href={`/${item.id === 'learn' ? '' : item.id}`}>
                <div
                  className={`flex items-center p-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors group cursor-pointer ${
                    currentSection === item.id ? 'active bg-primary-50 text-primary-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    currentSection === item.id 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.badge}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <ProgressBar />
    </aside>
  );
};

export default Sidebar;
