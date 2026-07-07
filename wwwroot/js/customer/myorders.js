// ===== CUSTOMER MY ORDERS =====
$(function () {
    loadMyOrders();

    function loadMyOrders() {
        $.get('/Customer/MyOrders/get', function (data) {
            renderOrders(data);
        }).fail(function () {
            // Show sample data for UI demo
            renderOrders([
                { id: 'GC-2024-001', pkg: 'Indian Buffet', date: '2024-12-20', pax: 150, status: 'Confirmed', amount: 2700, paid: 1350 },
                { id: 'GC-2024-002', pkg: 'Wedding Feast', date: '2025-01-15', pax: 300, status: 'Quotation', amount: 10500, paid: 0 }
            ]);
        });
    }

    function renderOrders(orders) {
        var html = '';
        if (!orders || orders.length === 0) {
            html = '<div class="card"><p class="muted">No orders found. <a href="/Customer/Order">Place your first order</a>.</p></div>';
        } else {
            orders.forEach(function (o) {
                var orderNumber = o.orderNumber || o.id || 'Unknown';
                var packageLabel = o.packageId || '-';
                var eventDate = o.eventStartDateTime || '-';
                var total = parseFloat(o.totalAmount) || 0;
                var paid = parseFloat(o.paidAmount) || 0;
                var balance = total - paid;
                var status = (o.orderStatus || 'Pending').toLowerCase();
                html += '<div class="order-card">' +
                    '<div class="order-card-header">' +
                    '<span class="order-ref">' + orderNumber + '</span>' +
                    '<span class="badge badge-' + status + '">' + (o.orderStatus || 'Pending') + '</span>' +
                    '</div>' +
                    '<div class="order-meta">' +
                    '<div class="order-meta-item"><strong>Package</strong>' + packageLabel + '</div>' +
                    '<div class="order-meta-item"><strong>Event Date</strong>' + eventDate + '</div>' +
                    '<div class="order-meta-item"><strong>Pax</strong>' + (o.pax || 0) + '</div>' +
                    '<div class="order-meta-item"><strong>Balance</strong>S$' + balance.toFixed(2) + '</div>' +
                    '</div>' +
                    '<div class="actions" style="margin-top:10px">' +
                    '<a href="/Customer/Track?ref=' + encodeURIComponent(orderNumber) + '" class="btn btn-light btn-xs">📍 Track</a>' +
                    '<a href="https://wa.me/6591234567?text=Order+' + encodeURIComponent(orderNumber) + '" target="_blank" class="btn btn-orange btn-xs">💬 WhatsApp</a>' +
                    '</div>' +
                    '</div>';
            });
        }
        $('#ordersList').html(html);
    }
});
