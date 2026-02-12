import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApertureIcon } from './icons/ApertureIcon';
import { ProductsIcon } from './icons/ProductsIcon';
import { CameraIcon } from './icons/CameraIcon';
import { ImageIcon } from './icons/ImageIcon';
import { GenerationsIcon } from './icons/GenerationsIcon';
import { CloseIcon } from './icons/CloseIcon';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, onClick, href = "#" }) => (
    <a href={href} onClick={onClick} className="flex items-center gap-4 px-4 py-3 rounded-lg text-neutral-200 hover:bg-neutral-800 transition-colors">
        {icon}
        <span className="font-medium text-lg">{label}</span>
    </a>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside 
                className={`fixed top-0 left-0 h-full w-72 bg-black z-[60] flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <div className="absolute top-4 right-4 z-10">
                     <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 bg-gold-700 border-b-2 border-gold-600">
                    <a href="#" className="flex items-center gap-4 text-white">
                        <ApertureIcon className="w-7 h-7" />
                        <span id="sidebar-title" className="font-semibold text-xl">Get Started</span>
                    </a>
                </div>
                <nav className="flex-grow p-4 flex flex-col space-y-3 mt-2">
                    <NavLink icon={<ProductsIcon className="w-6 h-6 text-neutral-300" />} label="Products" />
                    <NavLink icon={<CameraIcon className="w-6 h-6 text-neutral-300" />} label="Photoshoots" />
                    <NavLink icon={<ImageIcon className="w-6 h-6 text-neutral-300" />} label="Models" />
                    <NavLink icon={<GenerationsIcon className="w-6 h-6 text-neutral-300" />} label="Generations" />
                    <NavLink 
                        icon={<GenerationsIcon className="w-6 h-6 text-neutral-300" />} 
                        label="History" 
                        onClick={() => handleNavigate('/previously-generated')}
                    />
                </nav>
            </aside>
        </>
    );
};