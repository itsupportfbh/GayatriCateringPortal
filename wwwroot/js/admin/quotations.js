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
                <span class="badge bg-warning">
                    Quotation
                </span>
            </td>
            <td>${item.paidAmount}</td>            
            <td>${item.totalAmount}</td>
        </tr>`;
    });

    $("#quotationsTable tbody").html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('quotationsTable');
    }
}