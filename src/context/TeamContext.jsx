import { createContext, useContext, useState } from 'react';
import { teams as initialTeams } from '../data/teams';
import { players as initialPlayers } from '../data/players';

const TeamContext = createContext();

const LOGO_OPTIONS = ['⚡', '🐺', '🌊', '🔥', '⭐', '🦅', '🦁', '🌩️', '🏆', '🎯', '💎', '🦊', '🐯', '🦈', '🐉', '🦂'];
const COLOR_OPTIONS = [
    '#FFD700', '#FF4500', '#1E90FF', '#00CED1', '#FF6347',
    '#228B22', '#800020', '#4169E1', '#CE93D8', '#FF9800',
    '#00E676', '#448AFF', '#FF5252', '#FFD600', '#00BCD4',
];

export { LOGO_OPTIONS, COLOR_OPTIONS };

export function TeamProvider({ children }) {
    const [teams, setTeams] = useState(initialTeams);
    const [players, setPlayers] = useState(initialPlayers);

    const createTeam = (data) => {
        const newId = Math.max(...teams.map((t) => t.id), 0) + 1;
        const newTeam = {
            id: newId,
            name: data.name,
            logo: data.logo || '⭐',
            city: data.city || '',
            color: data.color || '#448AFF',
            founded: data.founded || new Date().toISOString().slice(0, 7),
            captain: null,
            playerIds: [],
            wins: 0, losses: 0, draws: 0,
            goalsScored: 0, goalsConceded: 0,
            rating: 4.0,
        };
        setTeams((prev) => [...prev, newTeam]);
        return newId;
    };

    const updateTeam = (teamId, updates) => {
        setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, ...updates } : t));
    };

    const deleteTeam = (teamId) => {
        setPlayers((prev) => prev.map((p) => p.teamId === teamId ? { ...p, teamId: null } : p));
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
    };

    const addPlayerToTeam = (playerId, teamId) => {
        const player = players.find((p) => p.id === playerId);
        // Remove from old team
        if (player?.teamId) {
            setTeams((prev) => prev.map((t) =>
                t.id === player.teamId
                    ? { ...t, playerIds: t.playerIds.filter((id) => id !== playerId), captain: t.captain === playerId ? null : t.captain }
                    : t
            ));
        }
        // Add to new team
        setTeams((prev) => prev.map((t) =>
            t.id === teamId ? { ...t, playerIds: [...t.playerIds.filter((id) => id !== playerId), playerId] } : t
        ));
        setPlayers((prev) => prev.map((p) => p.id === playerId ? { ...p, teamId } : p));
    };

    const removePlayerFromTeam = (playerId, teamId) => {
        setTeams((prev) => prev.map((t) =>
            t.id === teamId
                ? { ...t, playerIds: t.playerIds.filter((id) => id !== playerId), captain: t.captain === playerId ? null : t.captain }
                : t
        ));
        setPlayers((prev) => prev.map((p) => p.id === playerId ? { ...p, teamId: null } : p));
    };

    const setCaptain = (playerId, teamId) => {
        setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, captain: playerId } : t));
    };

    return (
        <TeamContext.Provider value={{ teams, players, createTeam, updateTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam, setCaptain, LOGO_OPTIONS, COLOR_OPTIONS }}>
            {children}
        </TeamContext.Provider>
    );
}

export const useTeams = () => useContext(TeamContext);
