// ===== ADMIN DASHBOARD =====
$(function () {
    var sampleOrders = [
        { id: 'GC-2026-001', quote: 'QT-2026-001', invoice: 'INV-2026-001', customer: 'Ravi Kumar', phone: '91234567', email: 'ravi@example.com', pkg: 'Non-Vegetarian Indian Buffet', location: 'Tanjong Pagar', date: '2026-07-01', period: 'Lunch', pax: 80, status: 'Completed', payment: 'Deposit Paid', amount: 1842.40, paid: 800 },
        { id: 'GC-2026-002', quote: 'QT-2026-002', invoice: 'INV-2026-002', customer: 'Priya Events', phone: '92345678', email: 'priya@example.com', pkg: 'Premium North Indian Feast', location: 'Orchard', date: '2026-07-05', period: 'Dinner', pax: 120, status: 'Completed', payment: 'Pending Balance', amount: 3716.00, paid: 1500 },
        { id: 'GC-2026-003', quote: 'QT-2026-003', invoice: 'INV-2026-003', customer: 'Aarav Pte Ltd', phone: '93456789', email: 'office@example.com', pkg: 'Indian Corporate Lunch Box', location: 'Changi', date: '2026-07-10', period: 'Lunch', pax: 45, status: 'Quotation', payment: 'Unpaid', amount: 714.40, paid: 0 }
    ];

    renderDashboard(sampleOrders);

    function money(value) {
        return 'S$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function renderDashboard(orders) {
        var totalOrders = orders.length;
        var activeOrders = orders.filter(function (o) { return ['Confirmed', 'Kitchen', 'Dispatch'].indexOf(o.status) > -1; }).length;
        var totalSales = orders.reduce(function (sum, o) { return sum + o.amount; }, 0);
        var outstanding = orders.reduce(function (sum, o) { return sum + (o.amount - o.paid); }, 0);

        $('#kpiOrders').text(totalOrders);
        $('#kpiActive').text(activeOrders);
        $('#kpiRevenue').text(money(totalSales));
        $('#kpiOutstanding').text(money(outstanding));

        var html = '<table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Package</th><th>Date</th><th>Pax</th><th>Status</th><th>Payment</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>';
        orders.forEach(function (o) {
            html += '<tr>' +
                '<td><strong style="color:#1d4ed8">' + o.id + '</strong><div class="muted">' + o.quote + ' / ' + o.invoice + '</div></td>' +
                '<td><strong>' + o.customer + '</strong><div class="muted">' + o.phone + ' · ' + o.email + '</div></td>' +
                '<td>' + o.pkg + '<div class="muted">' + o.location + '</div></td>' +
                '<td>' + o.date + '<div class="muted">' + o.period + '</div></td>' +
                '<td>' + o.pax + '</td>' +
                '<td><span class="badge badge-' + o.status.toLowerCase() + '">' + o.status + '</span></td>' +
                '<td><span class="badge ' + paymentClass(o.payment) + '">' + o.payment + '</span><div class="muted">Paid ' + money(o.paid) + '</div></td>' +
                '<td class="num"><strong>' + money(o.amount) + '</strong></td>' +
                '<td><div class="actions"><a href="/Admin/Orders" class="btn btn-light btn-xs">View</a><button class="btn btn-primary btn-xs">Next</button><a class="btn btn-orange btn-xs" target="_blank" href="https://wa.me/65' + o.phone + '">WA</a></div></td>' +
                '</tr>';
        });
        html += '</tbody></table>';
        $('#recentOrders').html(html);
    }

    function paymentClass(payment) {
        if (payment === 'Deposit Paid') return 'badge-paid';
        if (payment === 'Pending Balance') return 'badge-unpaid';
        return 'badge-unpaid';
    }
});
