// ===== ADMIN REPORTS =====
$(function () {
    var revenue = [
        { name: 'Non-Vegetarian Indian Buffet', amount: 1842.40 },
        { name: 'Premium North Indian Feast', amount: 3716.00 },
        { name: 'Indian Corporate Lunch Box', amount: 714.40 }
    ];
    var coverage = [
        'Kitchen Cumulative',
        'Full Order Details',
        'Finance GST & Payments',
        'Transport Allocation',
        'Menu Popularity',
        'Utensils Usage / Deposit'
    ];

    var max = Math.max.apply(null, revenue.map(function (r) { return r.amount; }));
    var barsHtml = '<div class="report-bars">';
    revenue.forEach(function (r) {
        barsHtml += '<div class="report-bar-row">' +
            '<div class="report-bar-label">' + r.name + '</div>' +
            '<div class="report-bar-track"><div class="report-bar-fill" style="width:' + Math.max(8, (r.amount / max) * 100) + '%">S$' + r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</div></div>' +
            '</div>';
    });
    barsHtml += '</div>';
    $('#reportBars').html(barsHtml);

    var cardsHtml = '<div class="report-coverage-grid">';
    coverage.forEach(function (item) {
        cardsHtml += '<div class="report-coverage-card"><b>' + item + '</b><p class="hint">Export Excel/PDF in backend.</p></div>';
    });
    cardsHtml += '</div>';
    $('#reportCoverage').html(cardsHtml);
});
