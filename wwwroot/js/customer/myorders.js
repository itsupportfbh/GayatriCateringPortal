// ===== CUSTOMER MY ORDERS =====
$(function () {
    var myOrders = [];
    var initialPhone = new URLSearchParams(window.location.search).get('phoneNo') || '';
    $('#myOrdersPhone').val(initialPhone);
    if (initialPhone) loadMyOrders(initialPhone);
    else showPhonePrompt();

    function loadMyOrders(phoneNo) {
        $('#ordersList').html('<div class="muted">Loading orders...</div>');
        $.get('/Customer/MyOrders/get', { phoneNo: phoneNo }, function (data) {
            myOrders = Array.isArray(data) ? data : [];
            renderOrders(myOrders);
        }).fail(function (xhr) {
            var message = xhr.responseJSON?.message || 'Unable to load your orders.';
            $('#ordersList').html('<div class="muted">' + escapeHtml(message) + '</div>');
        });
    }

    $('#btnFindMyOrders').on('click', function () {
        var phoneNo = ($('#myOrdersPhone').val() || '').trim();
        if (!phoneNo) {
            showPhonePrompt();
            $('#myOrdersPhone').focus();
            return;
        }
        loadMyOrders(phoneNo);
    });

    $('#myOrdersPhone').on('keydown', function (event) {
        if (event.key === 'Enter') $('#btnFindMyOrders').trigger('click');
    });

    function showPhonePrompt() {
        $('#ordersList').html('<div class="card"><div class="muted">Enter your phone number to view your orders.</div></div>');
    }

    function renderOrders(orders) {
        if (!orders.length) {
            $('#ordersList').html('<div class="card"><p class="muted">No orders found for this phone number.</p></div>');
            return;
        }

        var html = '';

        orders.forEach(function (o) {
            var orderNumber = o.orderNumber || ('#' + o.id);
            var total = Number(o.totalAmount) || 0;
            var paid = Number(o.paidAmount) || 0;
            var balance = Math.max(0, total - paid);
            var statusLabel = o.orderStatusName || 'Pending';
            var statusClass = cssName(statusLabel);
            var paymentLabel = paymentStatusName(o.paymentStatus);
            var mobile = String(o.mobileNo || '').replace(/\D/g, '');

            html += '<article class="order-card">' +
                '<div class="order-card-header">' +
                '<strong class="order-ref">' + escapeHtml(orderNumber) + '</strong>' +
                '<span class="badge badge-' + statusClass + '">' + escapeHtml(statusLabel) + '</span>' +
                '</div>' +
                '<div class="order-meta order-meta--details">' +
                '<div class="order-meta-item"><strong>Package</strong><span>' + escapeHtml(o.packageName || '-') + '</span></div>' +
                '<div class="order-meta-item"><strong>Event Date</strong><span>' + displayDate(o.eventDate) + '</span></div>' +
                '<div class="order-meta-item"><strong>Meal Period</strong><span>' + escapeHtml(o.mealPeriodName || '-') + '</span></div>' +
                '<div class="order-meta-item"><strong>Pax</strong><span>' + (Number(o.pax) || 0) + '</span></div>' +
                '<div class="order-meta-item"><strong>Location</strong><span>' + escapeHtml(o.locationName || '-') + '</span></div>' +
                '<div class="order-meta-item"><strong>Payment</strong><span class="badge ' + paymentClass(paymentLabel) + '">' + escapeHtml(paymentLabel) + '</span></div>' +
                '<div class="order-meta-item"><strong>Total</strong><span>S$' + total.toFixed(2) + '</span></div>' +
                '<div class="order-meta-item"><strong>Paid</strong><span>S$' + paid.toFixed(2) + '</span></div>' +
                '<div class="order-meta-item"><strong>Balance</strong><span>S$' + balance.toFixed(2) + '</span></div>' +
                '</div>' +
                '<div class="actions order-card-actions">' +
                '<button type="button" class="btn btn-primary btn-xs btn-view-my-order" data-id="' + o.id + '">View Order</button>' +
                '<a href="/Customer/Track?ref=' + encodeURIComponent(orderNumber) + '" class="btn btn-light btn-xs">Track</a>' +
                '<a href="https://wa.me/65' + mobile + '?text=Order+' + encodeURIComponent(orderNumber) + '" target="_blank" class="btn btn-orange btn-xs">WhatsApp</a>' +
                '</div></article>';
        });

        $('#ordersList').html(html);
    }

    $(document).on('click', '.btn-view-my-order', function () {
        var id = Number($(this).data('id'));
        var o = myOrders.find(function (item) { return Number(item.id) === id; });
        if (!o) return;

        var total = Number(o.totalAmount) || 0;
        var paid = Number(o.paidAmount) || 0;
        var balance = Math.max(0, total - paid);
        var html = '<div class="modal-header"><span class="modal-title">Order ' + escapeHtml(o.orderNumber || ('#' + o.id)) + '</span>' +
            '<button type="button" class="modal-close" id="closeMyOrderModal">&times;</button></div>' +
            '<div class="my-order-modal-grid">' +
            detailRow('Customer', o.customerName || '-') +
            detailRow('Mobile', o.mobileNo || '-') +
            detailRow('Email', o.emailId || '-') +
            detailRow('Package', o.packageName || '-') +
            detailRow('Event Date', displayDate(o.eventDate)) +
            detailRow('Meal Period', o.mealPeriodName || '-') +
            detailRow('Location', o.locationName || '-') +
            detailRow('Pax', Number(o.pax) || 0) +
            detailRow('Order Status', o.orderStatusName || 'Pending') +
            detailRow('Payment Status', paymentStatusName(o.paymentStatus)) +
            detailRow('Total', 'S$' + total.toFixed(2)) +
            detailRow('Paid / Balance', 'S$' + paid.toFixed(2) + ' / S$' + balance.toFixed(2)) +
            '</div><div class="actions my-order-modal-actions"><button type="button" class="btn btn-light" id="closeMyOrderModalBtn">Close</button></div>';

        $('#myOrderModalBox').html(html);
        $('#myOrderModal').removeClass('hidden');
    });

    function detailRow(label, value) {
        return '<div class="my-order-modal-item"><strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(value) + '</span></div>';
    }

    function closeMyOrderModal() {
        $('#myOrderModal').addClass('hidden');
        $('#myOrderModalBox').html('');
    }

    $(document).on('click', '#closeMyOrderModal, #closeMyOrderModalBtn', closeMyOrderModal);
    $('#myOrderModal').on('click', function (event) {
        if (event.target.id === 'myOrderModal') closeMyOrderModal();
    });

    function paymentStatusName(payment) {
        var value = String(payment ?? '').trim();
        if (value === '0') return 'Pending';
        if (value === '1') return 'Partially Paid';
        if (value === '2') return 'Paid';
        return value || 'Pending';
    }

    function paymentClass(payment) {
        if (payment === 'Paid') return 'badge-paid';
        if (payment === 'Partially Paid') return 'badge-partially-paid';
        return 'badge-unpaid';
    }

    function cssName(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    function displayDate(value) {
        if (!value) return '-';
        var date = new Date(value);
        return isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleDateString('en-CA');
    }

    function escapeHtml(value) {
        return $('<div>').text(value ?? '').html();
    }
});
