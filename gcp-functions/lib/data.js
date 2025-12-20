// create N dummy items for each report type
export function buildDemoItems(total, reportType) {
    let names;
    switch (reportType) {
        case 'A':
            names = [
                'Mercedes',
                'BMW',
                'Audi',
                'Lexus',
                'Volvo',
                'Jaguar',
                'Porsche',
                'Tesla',
                'Toyota',
                'Honda',
                'Mazda',
            ];
            break;
        case 'B':
            names = [
                'Bloomberg',
                'CNBC',
                'Financial Times',
                'NYTimes',
                'MarketWatch',
                'The Verge',
                'WSJ',
                'CNN',
                'Forbes',
                'Reuters',
                'TechCrunch',
            ];
            break;
        case 'C':
            names = [
                'Apple',
                'Google',
                'Microsoft',
                'Amazon',
                'Meta',
                'Netflix',
                'Adobe',
                'Intel',
                'AMD',
                'Nvidia',
                'Samsung',
            ];
            break;
        case 'D':
            names = [
                'Red',
                'Blue',
                'Green',
                'Yellow',
                'Purple',
                'Orange',
                'Pink',
                'Brown',
                'Gray',
                'Black',
                'White',
            ];
            break;
        default:
            names = ['Demo', 'Sample', 'Test', 'Example', 'Mock'];
    }
    const arr = [];
    for (let i = 0; i < total; i++) {
        arr.push({
            label: names[i % names.length] + ' #' + (i + 1),
            score: 35 + ((i * 7) % 65),
        });
    }
    return arr;
}
// Fake paginated API: returns chunks of size `pageSize`
export async function fetchPaginatedDemo(totalItems, pageSize, page, reportType) {
    const all = buildDemoItems(totalItems, reportType);
    const start = page * pageSize;
    const end = Math.min(start + pageSize, totalItems);
    await new Promise((r) => setTimeout(r, 150)); // simulate latency
    return { items: all.slice(start, end), hasMore: end < totalItems };
}
