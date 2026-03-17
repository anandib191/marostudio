import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface DropdownMenuProps {
    onClose: () => void;
    activeSection: string;
}

const navLinks: Array<{ path: string; label: string; isScroll?: boolean }> = [
  { path: '/', label: 'Overview' },
  { path: '#our-flow', label: 'Workflow', isScroll: true },
  { path: '/pricing', label: 'Pricing' },
  { path: '/contact', label: 'Have Query?' },
  { path: '/previously-generated', label: 'History' },
];

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ onClose, activeSection }) => {
    const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNavItem, setActiveNavItem] = useState<string>('/');

  // Initialize active nav item based on location
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveNavItem(location.pathname);
    } else if (location.hash === '#our-flow') {
      setActiveNavItem('#our-flow');
    } else {
      const scrollY = window.scrollY;
      const workflowSection = document.getElementById('our-flow');
      if (workflowSection && scrollY > 300) {
        const rect = workflowSection.getBoundingClientRect();
        if (rect.top < 200) {
          setActiveNavItem('#our-flow');
        } else {
          setActiveNavItem('/');
        }
      } else {
        setActiveNavItem('/');
      }
    }
  }, [location.pathname, location.hash]);

  // Scroll detection for active nav item on home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const workflowSection = document.getElementById('our-flow');
      const scrollPosition = window.scrollY;
      
      if (workflowSection) {
        const rect = workflowSection.getBoundingClientRect();
        const sectionTop = rect.top + scrollPosition;
        const viewportTop = scrollPosition;
        
        const isWorkflowActive = (
          sectionTop <= viewportTop + 250 && 
          sectionTop >= viewportTop - 100
        );
        
        if (isWorkflowActive && scrollPosition > 200) {
          setActiveNavItem('#our-flow');
        } else if (scrollPosition < 150) {
          setActiveNavItem('/');
        }
      } else {
        setActiveNavItem('/');
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

  const isActive = (path: string) => {
    if (location.pathname !== '/') {
      return location.pathname === path;
    }
    if (path === '/') {
      return activeNavItem === '/';
    }
    if (path === '#our-flow') {
      return activeNavItem === '#our-flow';
    }
    return location.pathname === path;
  };


    return (
        <>
            {/* Backdrop blur overlay */}
            <div 
                className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={menuRef}
                className="header-dropdown-menu fixed top-20 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm bg-neutral-950/95 backdrop-blur-xl rounded-2xl border border-gold-500/20 shadow-2xl p-8 animate-fade-in-down-right"
            >
            <nav className="flex flex-col items-center space-y-6">
                 {navLinks.map((link) => {
                  if (link.isScroll) {
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          setActiveNavItem('#our-flow');
                          onClose();
                          if (location.pathname !== '/') {
                            navigate('/');
                            setTimeout(() => {
                              const element = document.getElementById('our-flow');
                              if (element) {
                                const headerHeight = 100;
                                const elementPosition = element.offsetTop;
                                const offsetPosition = elementPosition - headerHeight - 40;
                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth'
                                });
                              }
                            }, 100);
                          } else {
                            const element = document.getElementById('our-flow');
                            if (element) {
                              const headerHeight = 100;
                              const elementPosition = element.offsetTop;
                              const offsetPosition = elementPosition - headerHeight - 40;
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                            }
                          }
                        }}
                        className={`transition-colors text-lg ${isActive(link.path) ? 'font-semibold text-white' : 'text-white hover:text-gold-300'}`}
                      >
                        {link.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => {
                        if (link.path === '/') {
                          setActiveNavItem('/');
                          if (location.pathname !== '/') {
                            navigate('/');
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }
                        onClose();
                      }}
                      className={`transition-colors text-lg ${isActive(link.path) ? 'font-semibold text-white' : 'text-white hover:text-gold-300'}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <button 
                  onClick={() => { (location.pathname === '/studio' ? navigate('/studio', { state: { start: true }, replace: true }) : navigate('/studio')); onClose(); }}
                  className="mt-6 w-full text-black bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-500 hover:from-gold-500 hover:via-yellow-500 hover:to-gold-600 font-bold text-base py-3.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(250,204,21,0.3)] border-2 border-gold-300/50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Launch Studio
                </button>
            </nav>
        </div>
        </>
    );
};
