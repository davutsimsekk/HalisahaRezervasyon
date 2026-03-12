export const referees = [
    {
        id: 1,
        name: 'Serhat Yılmaz',
        username: 'serhat_ref',
        avatar: 'https://i.pravatar.cc/150?img=50',
        city: 'İstanbul',
        licenseLevel: 'A Lisansı (Profesyonel)',
        matchesRefereed: 47,
        avgScore: 9.1,
        joinDate: '2023-06-15',
        bio: 'Futbola olan tutkumu sahadan hakemliğe taşıdım.',
        specialization: 'Halısaha Turnuvaları',
    },
    {
        id: 2,
        name: 'Caner Arslan',
        username: 'caner_ref',
        avatar: 'https://i.pravatar.cc/150?img=60',
        city: 'Ankara',
        licenseLevel: 'B Lisansı (Yarı Profesyonel)',
        matchesRefereed: 31,
        avgScore: 8.5,
        joinDate: '2024-01-20',
        bio: 'Adil kararlarımla sahada güven oluşturuyorum.',
        specialization: 'Bölgesel Turnuvalar',
    },
    {
        id: 3,
        name: 'Emrah Koçak',
        username: 'emrah_ref',
        avatar: 'https://i.pravatar.cc/150?img=65',
        city: 'İzmir',
        licenseLevel: 'B Lisansı (Yarı Profesyonel)',
        matchesRefereed: 19,
        avgScore: 8.0,
        joinDate: '2024-08-10',
        bio: 'Genç ve dinamik bir hakem olarak kariyerime devam ediyorum.',
        specialization: 'Yerel Turnuvalar',
    },
];

// Demo: Giriş yapmış hakem
export const currentReferee = referees[0];
