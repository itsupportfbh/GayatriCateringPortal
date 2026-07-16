// ===== ADMIN QUOTATIONS =====
$(function () {
    var quotations = [
        { id: 'GC-2026-003', quote: 'QT-2026-003', customer: 'Aarav Pte Ltd', phone: '93456789', email: 'office@example.com', pkg: 'Indian Corporate Lunch Box', location: 'Changi', date: '2026-07-10', period: 'Lunch', pax: 45, status: 'Quotation', payment: 'Unpaid', amount: 714.40, paid: 0 }
    ];

    renderTable(quotations);
    renderQuotation(quotations[0]);

    function money(value) {
        return 'S$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function renderTable(rows) {
        var html = '<table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Package</th><th>Date</th><th>Pax</th><th>Status</th><th>Payment</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>';
        rows.forEach(function (o) {
            html += '<tr>' +
                '<td><strong style="color:#1d4ed8">' + o.id + '</strong><div class="muted">' + o.quote + '</div></td>' +
                '<td><strong>' + o.customer + '</strong><div class="muted">' + o.phone + ' | ' + o.email + '</div></td>' +
                '<td>' + o.pkg + '<div class="muted">' + o.location + '</div></td>' +
                '<td>' + o.date + '<div class="muted">' + o.period + '</div></td>' +
                '<td>' + o.pax + '</td>' +
                '<td><span class="badge badge-quotation">Quotation</span></td>' +
                '<td><span class="badge badge-unpaid">Unpaid</span><div class="muted">Paid ' + money(o.paid) + '</div></td>' +
                '<td class="num"><strong>' + money(o.amount) + '</strong></td>' +
                '<td><div class="actions"><button class="btn btn-light btn-xs btn-preview" data-id="' + o.id + '">View</button><button class="btn btn-primary btn-xs">Next</button><a class="btn btn-orange btn-xs" target="_blank" href="https://wa.me/65' + o.phone + '">WA</a></div></td>' +
                '</tr>';
        });
        html += '</tbody></table>';
        $('#quotationsTable').html(html);
    }

    function renderQuotation(order) {
        var html = '<div class="quotation-preview-card">' +
            '<div class="quotation-preview-title">Quotation Preview</div>' +
            '<div class="quotation-preview-grid">' +
            '<div class="quotation-preview-item"><strong>Order</strong><div>' + order.id + '</div></div>' +
            '<div class="quotation-preview-item"><strong>Quotation</strong><div>' + order.quote + '</div></div>' +
            '<div class="quotation-preview-item"><strong>Customer</strong><div>' + order.customer + '</div></div>' +
            '<div class="quotation-preview-item"><strong>Date</strong><div>' + order.date + ' ' + order.period + '</div></div>' +
            '<div class="quotation-preview-item"><strong>Package</strong><div>' + order.pkg + '</div></div>' +
            '<div class="quotation-preview-item"><strong>Total</strong><div>' + money(order.amount) + '</div></div>' +
            '</div>' +
            '</div>';
        $('#quotationDoc').removeClass('hidden');
        $('#quotationDocContent').html(html);
    }

    $('#previewQuotationBtn').on('click', function () {
        $('#quotationDoc').toggleClass('hidden');
    });

    $('#emailQuotationBtn').on('click', function () {
        showToast('Outlook email queued for quotation');
    });

    $('#waQuotationBtn').on('click', function () {
        window.open('https://wa.me/6593456789', '_blank');
    });

    $(document).on('click', '.btn-preview', function () {
        renderQuotation(quotations[0]);
        $('html, body').animate({ scrollTop: $('#quotationDoc').offset().top - 80 }, 200);
    });
});
