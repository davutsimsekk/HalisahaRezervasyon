export const tournaments = [
    {
        id: 1,
        name: 'İstanbul Şampiyonası 2026',
        city: 'İstanbul',
        fieldId: 1,
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        status: 'active', // upcoming, active, completed
        prizePool: '5000 ₺',
        format: '8 Takım - Eleme',
        teamIds: [1, 2, 3, 4, 5, 6, 7, 8],
        bracket: {
            quarterFinals: [
                { id: 'qf1', team1Id: 1, team2Id: 8, score1: 4, score2: 1, winnerId: 1, played: true },
                { id: 'qf2', team1Id: 2, team2Id: 7, score1: 3, score2: 2, winnerId: 2, played: true },
                { id: 'qf3', team1Id: 3, team2Id: 6, score1: 2, score2: 2, winnerId: 3, played: true, penalty: '4-3' },
                { id: 'qf4', team1Id: 4, team2Id: 5, score1: 5, score2: 3, winnerId: 4, played: true },
            ],
            semiFinals: [
                { id: 'sf1', team1Id: 1, team2Id: 2, score1: 3, score2: 1, winnerId: 1, played: true },
                { id: 'sf2', team1Id: 3, team2Id: 4, score1: null, score2: null, winnerId: null, played: false },
            ],
            final: {
                id: 'f1', team1Id: null, team2Id: null, score1: null, score2: null, winnerId: null, played: false,
            },
        },
        topScorers: [
            { playerId: 1, goals: 5 },
            { playerId: 8, goals: 4 },
            { playerId: 5, goals: 3 },
        ],
    },
    {
        id: 2,
        name: 'Ankara Kış Kupası',
        city: 'Ankara',
        fieldId: 3,
        startDate: '2026-02-20',
        endDate: '2026-02-27',
        status: 'completed',
        prizePool: '3000 ₺',
        format: '4 Takım - Eleme',
        teamIds: [1, 2, 3, 4],
        bracket: {
            semiFinals: [
                { id: 'sf1', team1Id: 1, team2Id: 4, score1: 3, score2: 2, winnerId: 1, played: true },
                { id: 'sf2', team1Id: 2, team2Id: 3, score1: 1, score2: 4, winnerId: 3, played: true },
            ],
            final: {
                id: 'f1', team1Id: 1, team2Id: 3, score1: 2, score2: 1, winnerId: 1, played: true,
            },
        },
        topScorers: [
            { playerId: 1, goals: 4 },
            { playerId: 6, goals: 3 },
            { playerId: 8, goals: 2 },
        ],
    },
    {
        id: 3,
        name: 'Ege Yaz Turnuvası',
        city: 'İzmir',
        fieldId: 4,
        startDate: '2026-04-01',
        endDate: '2026-04-08',
        status: 'upcoming',
        prizePool: '4000 ₺',
        format: '8 Takım - Eleme',
        teamIds: [1, 2, 3, 4, 5, 6, 7, 8],
        bracket: {
            quarterFinals: [
                { id: 'qf1', team1Id: 1, team2Id: 5, score1: null, score2: null, winnerId: null, played: false },
                { id: 'qf2', team1Id: 2, team2Id: 6, score1: null, score2: null, winnerId: null, played: false },
                { id: 'qf3', team1Id: 3, team2Id: 7, score1: null, score2: null, winnerId: null, played: false },
                { id: 'qf4', team1Id: 4, team2Id: 8, score1: null, score2: null, winnerId: null, played: false },
            ],
            semiFinals: [
                { id: 'sf1', team1Id: null, team2Id: null, score1: null, score2: null, winnerId: null, played: false },
                { id: 'sf2', team1Id: null, team2Id: null, score1: null, score2: null, winnerId: null, played: false },
            ],
            final: {
                id: 'f1', team1Id: null, team2Id: null, score1: null, score2: null, winnerId: null, played: false,
            },
        },
        topScorers: [],
    },
];
