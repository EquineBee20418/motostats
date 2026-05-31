export function calculateCPK(transactions) {
    if (transactions.length < 2) return 0;
    const sorted = [...transactions].sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    const totalKM = (sorted[sorted.length-1].km || 0) - (sorted[0].km || 0);
    const totalSpent = transactions.reduce((sum, t) => sum + t.monto, 0);
    return totalKM > 0 ? (totalSpent / totalKM).toFixed(2) : 0;
}

export function getPeriodTotal(transactions, period) {
    const now = new Date();
    let startDate;

    if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
    }

    return transactions
        .filter(t => new Date(t.fecha) >= startDate)
        .reduce((sum, t) => sum + t.monto, 0);
}