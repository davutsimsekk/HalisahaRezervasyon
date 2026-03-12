import { createContext, useContext, useState } from 'react';

export const ROLES = [
    { id: 'player', label: 'Oyuncu', color: '#448AFF', bg: 'rgba(68,138,255,0.12)', emoji: '⚽' },
    { id: 'fieldOwner', label: 'Saha Sahibi', color: '#00E676', bg: 'rgba(0,230,118,0.12)', emoji: '🏟️' },
    { id: 'referee', label: 'Hakem', color: '#FFD600', bg: 'rgba(255,214,0,0.12)', emoji: '🟨' },
];

const RoleContext = createContext();

export function RoleProvider({ children }) {
    const [currentRole, setCurrentRole] = useState('fieldOwner');
    return (
        <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export const useRole = () => useContext(RoleContext);
