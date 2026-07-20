//// ===== ADMIN DASHBOARD =====
//$(function () {
//    var sampleOrders = [
//        { id: 'GC-2026-001', quote: 'QT-2026-001', invoice: 'INV-2026-001', customer: 'Ravi Kumar', phone: '91234567', email: 'ravi@example.com', pkg: 'Non-Vegetarian Indian Buffet', location: 'Tanjong Pagar', date: '2026-07-01', period: 'Lunch', pax: 80, status: 'Completed', payment: 'Deposit Paid', amount: 1842.40, paid: 800 },
//        { id: 'GC-2026-002', quote: 'QT-2026-002', invoice: 'INV-2026-002', customer: 'Priya Events', phone: '92345678', email: 'priya@example.com', pkg: 'Premium North Indian Feast', location: 'Orchard', date: '2026-07-05', period: 'Dinner', pax: 120, status: 'Completed', payment: 'Pending Balance', amount: 3716.00, paid: 1500 },
//        { id: 'GC-2026-003', quote: 'QT-2026-003', invoice: 'INV-2026-003', customer: 'Aarav Pte Ltd', phone: '93456789', email: 'office@example.com', pkg: 'Indian Corporate Lunch Box', location: 'Changi', date: '2026-07-10', period: 'Lunch', pax: 45, status: 'Quotation', payment: 'Unpaid', amount: 714.40, paid: 0 }
//    ];

//    renderDashboard(sampleOrders);

function money(value) {
    value = Number(value) || 0;
    return 'S$' + value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function renderDashboard(orders) {

    var html = '<table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Package</th><th>Date</th><th>Pax</th><th>Status</th><th>Payment</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>';
    orders.forEach(function (o) {

        html += '<tr>' +
            '<td><strong style="color:#1d4ed8">' + o.orderNumber + '</strong></td>' +

            '<td><strong>' + o.customerName + '</strong>' +
            '<div class="muted">' + o.mobileNo + ' · ' + o.emailId + '</div></td>' +

            '<td>' + o.packageName +
            '<div class="muted">' + o.locationName + '</div></td>' +

            '<td>' + o.eventDate +
            '<div class="muted">' + o.mealPeriodName + '</div></td>' +

            '<td>' + o.pax + '</td>' +

            '<td><span class="badge badge-' +
            o.orderStatusName.toLowerCase().replace(/\s+/g, '-') +
            '">' + o.orderStatusName + '</span></td>' +

            '<td><span class="badge ' +
            paymentClass(o.paymentStatusName) +
            '">' + o.paymentStatusName +
            '</span><div class="muted">Paid ' +
            money(o.paidAmount) +
            '</div></td>' +

            '<td class="num"><strong>' +
            money(o.totalAmount) +
            '</strong></td>' +

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
//});

//$(function () {
//    loadDashboardSummary();
//    //loadRecentOrders();
//});

//function loadDashboardSummary() {
//    $.ajax({
//        url: "/Admin/Dashboard/summary",
//        type: "GET",
//        dataType: "json",
//        success: function (res) {

//            $("#kpiOrders").text(res.totalOrders);
//            $("#kpiActive").text(res.activeOrders);
//            $("#kpiRevenue").text("S$" + Number(res.totalSales).toFixed(2));
//            $("#kpiOutstanding").text("S$" + Number(res.outstanding).toFixed(2));
//        },
//        error: function () {
//            showToast("Unable to load dashboard.");
//        }
//    });
//}

$(function () {
    loadDashboard();
});

function loadDashboard() {

    $.ajax({
        url: "/Admin/Dashboard/get",
        type: "GET",
        dataType: "json",
        success: function (res) {

            // Cards
            $("#kpiOrders").text(res.summary.totalOrders);
            $("#kpiActive").text(res.summary.activeOrders);
            $("#kpiRevenue").text("S$" + parseFloat(res.summary.totalSales).toFixed(2));
            $("#kpiOutstanding").text("S$" + parseFloat(res.summary.outstanding).toFixed(2));

            // Table
            renderDashboard(res.recentOrders);
        },
        error: function () {
            showToast("Unable to load dashboard.");
        }
    });

}