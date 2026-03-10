// Generate dates relative to "today"
const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const reservations = [
    { id: 1, fieldId: 1, userId: 1, date: fmt(today), hour: 18, status: 'confirmed', teamName: 'Yıldırım FK' },
    { id: 2, fieldId: 1, userId: 2, date: fmt(today), hour: 20, status: 'confirmed', teamName: 'Bozkurt Spor' },
    { id: 3, fieldId: 1, userId: 3, date: fmt(addDays(today, 1)), hour: 19, status: 'confirmed', teamName: 'Ege Fırtınası' },
    { id: 4, fieldId: 2, userId: 1, date: fmt(today), hour: 21, status: 'confirmed', teamName: 'Yıldırım FK' },
    { id: 5, fieldId: 2, userId: 5, date: fmt(addDays(today, 1)), hour: 18, status: 'pending', teamName: 'Bozkurt Spor' },
    { id: 6, fieldId: 3, userId: 3, date: fmt(today), hour: 17, status: 'confirmed', teamName: 'Ege Fırtınası' },
    { id: 7, fieldId: 3, userId: 6, date: fmt(addDays(today, 2)), hour: 20, status: 'confirmed', teamName: 'Anadolu Ateşi' },
    { id: 8, fieldId: 4, userId: 4, date: fmt(today), hour: 19, status: 'confirmed', teamName: 'Ege Fırtınası' },
    { id: 9, fieldId: 4, userId: 8, date: fmt(addDays(today, 1)), hour: 21, status: 'pending', teamName: 'Anadolu Ateşi' },
    { id: 10, fieldId: 5, userId: 7, date: fmt(addDays(today, 3)), hour: 18, status: 'confirmed', teamName: 'Anadolu Ateşi' },
    { id: 11, fieldId: 6, userId: 9, date: fmt(today), hour: 20, status: 'confirmed', teamName: 'Akdeniz Yıldızları' },
    { id: 12, fieldId: 6, userId: 1, date: fmt(addDays(today, 2)), hour: 22, status: 'confirmed', teamName: 'Yıldırım FK' },
];
