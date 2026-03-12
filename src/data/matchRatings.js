// Hakemler tarafından verilen oyuncu değerlendirmeleri
export const initialMatchRatings = [
    {
        id: 1,
        matchId: 'qf1',
        tournamentId: 1,
        refereeId: 1,
        date: '2026-03-15',
        ratings: [
            { playerId: 1, rating: 9, comment: 'Maçı domine etti, 2 gol attı.' },
            { playerId: 2, rating: 7, comment: 'Orta sahada dengeli bir performans.' },
            { playerId: 7, rating: 5, comment: 'Defansta konumlanma hataları yaptı.' },
            { playerId: 12, rating: 6, comment: 'Maç ortasında etkinliği azaldı.' },
        ],
    },
    {
        id: 2,
        matchId: 'qf2',
        tournamentId: 1,
        refereeId: 1,
        date: '2026-03-15',
        ratings: [
            { playerId: 3, rating: 8, comment: 'Defans hattını iyi yönetti.' },
            { playerId: 5, rating: 7, comment: 'Birkaç iyi kaçış pozisyonu.' },
        ],
    },
    {
        id: 3,
        matchId: 'sf1',
        tournamentId: 1,
        refereeId: 1,
        date: '2026-03-18',
        ratings: [
            { playerId: 1, rating: 10, comment: 'Muhteşem oyun, maçın en iyisi.' },
            { playerId: 9, rating: 8, comment: 'Takım oyununa mükemmel katkı.' },
            { playerId: 2, rating: 7, comment: 'Sabit ve güvenilir performans.' },
            { playerId: 3, rating: 6, comment: 'İlk yarı iyiydi, ikinci yarı düştü.' },
        ],
    },
];
