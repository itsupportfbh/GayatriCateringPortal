$(document).ready(function () {
    loadPendingOrder();
});

function loadPendingOrder() {

    $.ajax({
        url: '/Admin/Quotations/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderLogisList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderLogisList([]);
            showToast('Unable to load Quotation.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showlogiLoader(false);
        }
    });
}

function showlogiLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#QuotListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}
function renderLogisList(rows) {

    let html = "";

    rows.forEach(function (item, index) {

        html += `
        <tr>
            <td>${item.id}</td>            
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.customerName ?? ""}</td>
            <td>${item.packageName ?? ""}</td>
            <td>${item.createdDate}</td>
            <td>${item.pax}</td>
            <td>
                <span class="badge-pill badge-pill--success">
                    Quotation
                </span>
            </td>
            <td><span class="badge ${item.paymentStatus} "> ${item.paymentStatus} </span><div class="muted"> ${money(item.paidAmount)}</div></td>
            <td>${item.totalAmount}</td>
            <td><div class="actions"><a href="/Admin/Orders" class="btn btn-light btn-xs">View</a><button class="btn btn-primary btn-xs">Email</button><a class="btn btn-orange btn-xs" target="_blank" href="https://wa.me/65' + o.phone + '">WA</a></div></td>
        </tr>`;
    });

    $("#quotationsTable tbody").html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('quotationsTable');
    }
}

function money(value) {
    value = Number(value) || 0;
    return 'S$' + value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}