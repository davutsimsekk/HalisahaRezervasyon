export const allPackages = [
    // ── İçecek & Yiyecek ──────────────────────────────────────────────
    { id: 1,  emoji: '🥤', name: 'Gazoz Paketi',       category: 'cafeteria', price: 0,   desc: '15 kişiye soğuk gazoz hediye',                badge: 'Ücretsiz' },
    { id: 2,  emoji: '☕', name: 'Çay & Simit Paketi', category: 'cafeteria', price: 150, desc: 'Çay, simit ve su (15 kişi)',                    badge: null },
    { id: 3,  emoji: '🍕', name: 'Pizza Paketi',        category: 'cafeteria', price: 350, desc: '2 büyük pizza + 15 kişi içecek',               badge: 'Popüler' },
    { id: 4,  emoji: '💪', name: 'Sporcu Paketi',       category: 'cafeteria', price: 200, desc: '12 protein bar + sporcu içeceği seti',         badge: null },
    { id: 5,  emoji: '🍱', name: 'Maç Sonrası Yemek',  category: 'cafeteria', price: 500, desc: 'Izgara menü (12 kişilik), içecek dahil',       badge: null },

    // ── Özel Etkinlik ─────────────────────────────────────────────────
    { id: 6,  emoji: '🎂', name: 'Doğum Günü Paketi',  category: 'event',     price: 250, desc: 'Pasta + dekor + 15 balon + konfeti',           badge: null },
    { id: 7,  emoji: '🏆', name: 'Kupa Töreni',        category: 'event',     price: 180, desc: 'Minik kupa + sertifika (her oyuncu için)',     badge: null },
    { id: 8,  emoji: '🎉', name: 'Kutlama Paketi',     category: 'event',     price: 120, desc: 'Konfeti topu, pankart ve özel ilan',           badge: null },

    // ── Medya & Fotoğraf ──────────────────────────────────────────────
    { id: 9,  emoji: '📸', name: 'Maç Fotoğrafçısı',  category: 'media',     price: 200, desc: '1 saatlik profesyonel fotoğraf çekimi',        badge: null },
    { id: 10, emoji: '🎬', name: 'Video Paketi',       category: 'media',     price: 350, desc: 'Maç kayıt + highlight montaj (24 saat teslim)',badge: 'Yeni' },

    // ── Ekipman ───────────────────────────────────────────────────────
    { id: 11, emoji: '🎽', name: 'Forma Seti',         category: 'equipment', price: 100, desc: '10 adet numaralı maç forması kiralama',        badge: null },
    { id: 12, emoji: '🥅', name: 'Ekstra Kale',        category: 'equipment', price: 80,  desc: 'Taşınabilir 2. kale kurulumu dahil',           badge: null },
];

// fieldId → packageIds  (her sahanın sunduğu paketler)
export const fieldPackages = {
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],  // Yıldız Arena — tam paket
    2: [1, 2, 3, 6, 7, 9, 11, 12],
    3: [1, 2, 4, 6, 11],
    4: [1, 2, 3, 11],
    5: [1, 2, 3, 6, 9, 11, 12],
    6: [1, 2, 11],
    7: [1, 11],
    8: [1, 2, 11],
};

export const PACKAGE_CATEGORIES = {
    cafeteria: { label: 'Kafeterya',    color: '#FF9800' },
    event:     { label: 'Özel Etkinlik', color: '#CE93D8' },
    media:     { label: 'Medya',        color: '#448AFF' },
    equipment: { label: 'Ekipman',      color: '#00E676' },
};
