// ===== ADMIN ORDERS =====
$(function () {
    var orders = [
        { id: 'GC-2026-001', quote: 'QT-2026-001', invoice: 'INV-2026-001', customer: 'Ravi Kumar', phone: '91234567', email: 'ravi@example.com', pkg: 'Non-Vegetarian Indian Buffet', location: 'Tanjong Pagar', date: '2026-07-01', period: 'Lunch', pax: 80, status: 'Completed', payment: 'Deposit Paid', amount: 1842.40, paid: 800 },
        { id: 'GC-2026-002', quote: 'QT-2026-002', invoice: 'INV-2026-002', customer: 'Priya Events', phone: '92345678', email: 'priya@example.com', pkg: 'Premium North Indian Feast', location: 'Orchard', date: '2026-07-05', period: 'Dinner', pax: 120, status: 'Completed', payment: 'Pending Balance', amount: 3716.00, paid: 1500 },
        { id: 'GC-2026-003', quote: 'QT-2026-003', invoice: 'INV-2026-003', customer: 'Aarav Pte Ltd', phone: '93456789', email: 'office@example.com', pkg: 'Indian Corporate Lunch Box', location: 'Changi', date: '2026-07-10', period: 'Lunch', pax: 45, status: 'Quotation', payment: 'Unpaid', amount: 714.40, paid: 0 }
    ];

    renderOrders(orders);

    function money(value) {
        return 'S$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function renderOrders(rows) {
        var html = '<table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Package</th><th>Date</th><th>Pax</th><th>Status</th><th>Payment</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>';
        rows.forEach(function (o) {
            html += '<tr>' +
                '<td><strong style="color:#1d4ed8">' + o.id + '</strong><div class="muted">' + o.quote + ' / ' + o.invoice + '</div></td>' +
                '<td><strong>' + o.customer + '</strong><div class="muted">' + o.phone + ' � ' + o.email + '</div></td>' +
                '<td>' + o.pkg + '<div class="muted">' + o.location + '</div></td>' +
                '<td>' + o.date + '<div class="muted">' + o.period + '</div></td>' +
                '<td>' + o.pax + '</td>' +
                '<td><span class="badge badge-' + o.status.toLowerCase() + '">' + o.status + '</span></td>' +
                '<td><span class="badge ' + paymentClass(o.payment) + '">' + o.payment + '</span><div class="muted">Paid ' + money(o.paid) + '</div></td>' +
                '<td class="num"><strong>' + money(o.amount) + '</strong></td>' +
                '<td>' + window.buildRowActions(o.id, { active: o.status === 'Completed', showWA: true }) + '</td>' +
                '</tr>';
        });
        html += '</tbody></table>';
        $('#ordersContainer').html(html);

        // attach view handlers
        $('.view-order').on('click', function () {
            var id = $(this).data('id');
            openOrder(id);
        });
    }

    function paymentClass(payment) {
        if (payment === 'Deposit Paid') return 'badge-paid';
        if (payment === 'Pending Balance') return 'badge-unpaid';
        return 'badge-unpaid';
    }

    // Modal helpers
    function openModal(html) {
        $('#orderModalBox').html(html);
        $('#orderModal').removeClass('hidden');
    }

    function closeModal() {
        $('#orderModalBox').html('');
        $('#orderModal').addClass('hidden');
    }

    function openEditOrder(id) {
        var o = orders.find(function (x) { return x.id === id; });
        if (!o) return;
        var form = '<div class="form-group"><label>Customer</label><input id="orderCustomer" class="form-control" value="' + o.customer + '"></div>' +
                   '<div class="form-group"><label>Package</label><input id="orderPackage" class="form-control" value="' + o.pkg + '"></div>';
        var html = '<div class="modal-header"><h3>Edit Order ' + o.id + '</h3><button class="btn-close" id="closeOrderModal">×</button></div>';
        html += '<div class="modal-body">' + form + '</div>';
        html += '<div class="modal-footer"><button class="btn btn-light" id="closeOrderBtn">Cancel</button> <button class="btn btn-primary" id="saveOrderBtn">Save</button></div>';
        openModal(html);

        $('#closeOrderModal, #closeOrderBtn').on('click', function () { closeModal(); });
        $('#saveOrderBtn').on('click', function () {
            o.customer = $('#orderCustomer').val();
            o.pkg = $('#orderPackage').val();
            closeModal();
            renderOrders(orders);
        });
    }

    // Build and show order details
    function openOrder(id) {
        var o = orders.find(function (x) { return x.id === id; });
        if (!o) return;
        var html = '<div class="modal-header"><h3>Order ' + o.id + '</h3><button class="btn-close" id="closeOrderModal">×</button></div>';
        html += '<div class="modal-body">';
        html += '<p><strong>Customer:</strong> ' + o.customer + ' &nbsp; <span class="muted">' + o.phone + ' • ' + o.email + '</span></p>';
        html += '<p><strong>Package:</strong> ' + o.pkg + ' <span class="muted">(' + o.location + ')</span></p>';
        html += '<p><strong>Date:</strong> ' + o.date + ' • ' + o.period + ' • <strong>Pax:</strong> ' + o.pax + '</p>';
        html += '<hr />';
        html += '<p><strong>Status:</strong> <span class="badge badge-' + o.status.toLowerCase() + '">' + o.status + '</span> &nbsp; <strong>Payment:</strong> <span class="badge ' + paymentClass(o.payment) + '">' + o.payment + '</span></p>';
        html += '<p><strong>Amount:</strong> ' + money(o.amount) + ' &nbsp; <span class="muted">Paid ' + money(o.paid) + '</span></p>';
        html += '</div>';
        html += '<div class="modal-footer"><button class="btn btn-light" id="closeOrderBtn">Close</button> <button class="btn btn-primary">Next</button></div>';

        openModal(html);

        $('#closeOrderModal, #closeOrderBtn').on('click', function () { closeModal(); });
        // close when clicking overlay
        $('#orderModal').on('click', function (e) { if (e.target.id === 'orderModal') closeModal(); });
    }

    $(document).on('click', '.btn-edit', function () {
        openEditOrder($(this).data('id'));
    });

    $(document).on('click', '.btn-delete', function () {
        var id = $(this).data('id');
        orders = orders.filter(function (o) { return o.id !== id; });
        renderOrders(orders);
    });

    $(document).on('click', '.btn-toggle', function () {
        var id = $(this).data('id');
        var item = orders.find(function (o) { return o.id === id; });
        if (!item) return;
        item.status = item.status === 'Completed' ? 'Quotation' : 'Completed';
        renderOrders(orders);
    });

    $(document).on('click', '.btn-wa', function () {
        var id = $(this).data('id');
        var item = orders.find(function (o) { return o.id === id; });
        if (item) {
            window.open('https://wa.me/65' + item.phone, '_blank');
        }
    });
});
