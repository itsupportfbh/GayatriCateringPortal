// ===== ADMIN ORDERS =====
$(function () {
    var orders = [];

    loadOrders();

    function loadOrders() {
        $('#ordersContainer').html('<div class="muted">Loading orders...</div>');
        $.ajax({
            url: '/Admin/Orders/get',
            type: 'GET',
            data: {
                fromDate: $('#ordersFromDate').val() || null,
                toDate: $('#ordersToDate').val() || null
            },
            success: function (rows) {
                orders = Array.isArray(rows) ? rows : [];
                renderOrders(orders);
            },
            error: function (xhr) {
                var message = xhr.responseJSON?.message || 'Unable to load orders.';
                $('#ordersContainer').html('<div class="muted">' + escapeHtml(message) + '</div>');
            }
        });
    }

    $('#ordersFromDate, #ordersToDate').on('change', function () {
        var fromDate = $('#ordersFromDate').val();
        var toDate = $('#ordersToDate').val();
        if (fromDate && toDate && fromDate > toDate) {
            if (window.showToast) {
                showToast('From date cannot be later than To date.', 3000, { type: 'warning', title: 'Invalid date range' });
            }
            return;
        }
        loadOrders();
    });

    function money(value) {
        return 'S$' + (Number(value) || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function displayDate(value) {
        if (!value) return '-';
        var date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString('en-CA');
    }

    function escapeHtml(value) {
        return $('<div>').text(value ?? '').html();
    }

    function cssName(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    function renderOrders(rows) {
        var html = '<table class="tbl" id="ordersTable" data-page-size="10"><thead><tr>' +
            '<th class="sortable">#</th>' +
            '<th class="sortable">Order</th>' +
            '<th class="sortable">Customer</th>' +
            '<th class="sortable">Package / Pax</th>' +
            '<th class="sortable">Date</th>' +
            '<th class="sortable">Order Status</th>' +
            '<th class="sortable">Payment Status</th>' +
            '<th class="sortable num">Amount</th>' +
            '<th class="no-sort">Actions</th>' +
            '</tr></thead><tbody>';
        rows.forEach(function (o, index) {
            var paymentStatus = paymentStatusName(o.paymentStatus);
            var serial = index + 1;

            var kitchenButton = '';
            if (Number(o.orderStatus) === 0) {
                kitchenButton = `
        <button type="button"
                class="btn btn-primary btn-xs btn-next-order"
                data-id="${o.id}"
                data-status="1">
            Send to Kitchen
        </button>`;
            }

            html += '<tr>' +
                '<td>' + serial + '</td>' +
                '<td><strong style="color:#1d4ed8">' + escapeHtml(o.orderNumber || ('#' + o.id)) + '</strong></td>' +
                '<td><strong>' + escapeHtml(o.customerName) + '</strong><div class="muted">' + escapeHtml(o.mobileNo) + ' &bull; ' + escapeHtml(o.emailId) + '</div></td>' +
                '<td>' + escapeHtml(o.packageName || '-') + '<div class="muted">Pax: ' + (Number(o.pax) || 0) + ' &bull; ' + escapeHtml(o.locationName || '-') + '</div></td>' +
                '<td>' + displayDate(o.eventDate) + '<div class="muted">' + escapeHtml(o.mealPeriodName || '-') + '</div></td>' +
                '<td><span class="badge badge-' + cssName(o.orderStatusName) + '">' + escapeHtml(o.orderStatusName) + '</span></td>' +
                '<td><span class="badge ' + paymentClass(paymentStatus) + '">' + escapeHtml(paymentStatus) + '</span><div class="muted">Paid ' + money(o.paidAmount) + '</div></td>' +
                '<td class="num"><strong>' + money(o.totalAmount) + '</strong></td>' +
                '<td><div class="actions order-row-actions">' +
                '<button type="button" class="btn btn-light btn-xs view-order" data-id="' + o.id + '">View</button>' +
                kitchenButton +
                '<button type="button" class="btn btn-orange btn-xs btn-wa" data-id="' + o.id + '">WA</button>' +
                '</div></td>' +
                '</tr>';
        });
        html += '</tbody></table>';
        $('#ordersContainer').html(html);

        if (typeof renderDataTable === 'function') {
            renderDataTable('ordersTable');
        }
    }

    function paymentClass(payment) {
        if (payment === 'Paid') return 'badge-paid';
        if (payment === 'Partially Paid') return 'badge-partially-paid';
        return 'badge-unpaid';
    }

    function paymentStatusName(payment) {
        var value = String(payment ?? '').trim();
        if (value === '0') return 'Pending';
        if (value === '1') return 'Partially Paid';
        if (value === '2') return 'Paid';
        return value || 'Pending';
    }

    function openModal(html) {
        $('#orderModalBox').html(html);
        $('#orderModal').removeClass('hidden');
    }

    function closeModal() {
        $('#orderModalBox').html('');
        $('#orderModal').addClass('hidden');
    }

    function openOrder(id) {
        var o = orders.find(function (item) { return Number(item.id) === Number(id); });
        if (!o) return;
        var html = '<div class="modal-header"><h3>Order ' + escapeHtml(o.orderNumber || ('#' + o.id)) + '</h3><button class="btn-close" id="closeOrderModal">&times;</button></div>' +
            '<div class="modal-body">' +
            '<p><strong>Customer:</strong> ' + escapeHtml(o.customerName) + ' <span class="muted">' + escapeHtml(o.mobileNo) + ' &bull; ' + escapeHtml(o.emailId) + '</span></p>' +
            '<p><strong>Package:</strong> ' + escapeHtml(o.packageName || '-') + ' <span class="muted">(' + escapeHtml(o.locationName || '-') + ')</span></p>' +
            '<p><strong>Date:</strong> ' + displayDate(o.eventDate) + ' &bull; ' + escapeHtml(o.mealPeriodName || '-') + ' &bull; <strong>Pax:</strong> ' + (Number(o.pax) || 0) + '</p><hr>' +
            '<p><strong>Status:</strong> ' + escapeHtml(o.orderStatusName) + ' &nbsp; <strong>Payment:</strong> ' + escapeHtml(paymentStatusName(o.paymentStatus)) + '</p>' +
            '<p><strong>Amount:</strong> ' + money(o.totalAmount) + ' <span class="muted">Paid ' + money(o.paidAmount) + '</span></p>' +
            '</div><div class="modal-footer"><button class="btn btn-light" id="closeOrderBtn">Close</button></div>';
        openModal(html);
    }

    $(document).on('click', '.view-order', function () {
        openOrder($(this).data('id'));
    });

    $(document).on('click', '.btn-next-order', function () {
        var button = $(this);
        if (button.prop('disabled')) return;
        var orderId = Number(button.data('id'));
        var status = Number(button.data('status'));

        if (!orderId || !Number.isInteger(status)) {
            if (window.showToast) {
                showToast('Invalid order status request.', 3000, { type: 'error', title: 'Update failed' });
            }
            return;
        }

        button.prop('disabled', true).text('Updating...');
        $.ajax({
            url: '/Admin/Orders/UpdateOrderStatus?OrderId=' + encodeURIComponent(orderId) + '&Status=' + encodeURIComponent(status),
            type: 'POST',
            success: function (response) {
                if (response?.success) {
                    if (window.showToast) showToast(response.message || 'Order status updated.', 3000, { type: 'success', title: 'Status updated' });
                    loadOrders();
                }
            },
            error: function (xhr) {
                if (window.showToast) {
                    showToast(xhr.responseJSON?.message || 'Unable to update order status.', 3500, { type: 'error', title: 'Update failed' });
                }
                button.prop('disabled', false).text('Send to Kitchen');
            }
        });
    });

    $(document).on('click', '#closeOrderModal, #closeOrderBtn', closeModal);
    $('#orderModal').on('click', function (event) {
        if (event.target.id === 'orderModal') closeModal();
    });

    $(document).on('click', '.btn-wa', function () {
        var id = $(this).data('id');
        var item = orders.find(function (order) { return Number(order.id) === Number(id); });
        if (item?.mobileNo) window.open('https://wa.me/65' + item.mobileNo.replace(/\D/g, ''), '_blank');
    });
});
