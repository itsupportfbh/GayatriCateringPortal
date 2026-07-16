var kitchenActiveTab = 'queue';

$(document).ready(function () {
    loadKitchenOrders(1);
});

function openKitchenTab(tab) {
    kitchenActiveTab = tab === 'ready' ? 'ready' : 'queue';
    loadKitchenOrders(kitchenActiveTab === 'ready' ? 2 : 1);
}

function applyKitchenFilter() {
    loadKitchenOrders(kitchenActiveTab === 'ready' ? 2 : 1);
}

function resetKitchenFilter() {
    clearKitchenDateInput('kitchenFromDate');
    clearKitchenDateInput('kitchenToDate');
    loadKitchenOrders(kitchenActiveTab === 'ready' ? 2 : 1);
}

function clearKitchenDateInput(inputId) {
    var input = document.getElementById(inputId);
    if (!input) return;

    if (input._flatpickr) {
        input._flatpickr.clear();
        return;
    }

    input.value = '';
}

function markKitchenReady(orderId) {
    kitchenActiveTab = 'ready';
    loadKitchenOrders(2);
    showToast('Order marked ready for delivery.', 2200, { type: 'success', title: 'Updated' });
}

function viewKitchenOrder(orderId) {
    showToast('Order details page will be connected soon.', 2200, { type: 'info', title: 'View Order' });
}

function showKitchenLoader(show) {
    var $panel = $('#kitchenQueueBoard .pageloaderpanel');
    if ($panel.length) {
        $('#kitchenContentWrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
    }
}

function loadKitchenOrders(status) {
    var fromDate = $('#kitchenFromDate').val() || '';
    var toDate = $('#kitchenToDate').val() || '';
    var $content = $('#kitchenContent');

    showKitchenLoader(true);

    $.ajax({
        url: '/Admin/Kitchen/GetKitchenQueueOrders?Status=' + status + '&Fromdate=' + encodeURIComponent(fromDate) + '&ToDate=' + encodeURIComponent(toDate),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '' +
                '<div class="kitchen-tabs">' +
                    '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'queue' ? ' active' : '') + '" onclick="openKitchenTab(\'queue\')">Queue <span class="kitchen-tab-count">' + (kitchenActiveTab === 'queue' ? list.length : 0) + '</span></button>' +
                    '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'ready' ? ' active' : '') + '" onclick="openKitchenTab(\'ready\')">Ready for Delivery <span class="kitchen-tab-count">' + (kitchenActiveTab === 'ready' ? list.length : 0) + '</span></button>' +
                '</div>' +
                '<div class="kitchen-grid">';

            for (var i = 0; i < list.length; i++) {
                var item = list[i] || {};
                var isReady = parseInt(item.orderStatus, 10) === 2;

                html += '' +
                    '<article class="kitchen-order-card">' +
                        '<div class="kitchen-order-top">' +
                            '<div class="kitchen-order-date">' + escapeKitchenHtml(formatKitchenDate(item.orderDate)) + ' - ' + escapeKitchenHtml((item.mealPeriod || '').toString().toUpperCase()) + '</div>' +
                            '<span class="kitchen-order-id">' + escapeKitchenHtml(item.orderNumber || '') + '</span>' +
                        '</div>' +
                        '<h3 class="kitchen-order-title">' + escapeKitchenHtml(item.customerName || '') + '</h3>' +
                        '<p class="kitchen-order-meta">' + escapeKitchenHtml(item.packageName || '') + '</p>' +
                        '<div class="kitchen-order-event">Event Date: ' + escapeKitchenHtml(formatKitchenDate(item.eventDate) || formatKitchenDate(item.orderDate)) + '</div>' +
                        '<div class="kitchen-order-facts">' +
                            '<span class="kitchen-fact-chip">' + escapeKitchenHtml(parseInt(item.pax, 10) || 0) + ' pax</span>' +
                        '</div>' +
                        '<div class="kitchen-card-footer">' +
                            '<div class="kitchen-status-pill ' + (isReady ? 'is-ready' : 'is-queue') + '">' + (isReady ? 'Ready for Delivery' : 'In Queue') + '</div>' +
                            '<div class="kitchen-card-actions">' +
                                '<button type="button" class="btn btn-light" onclick="viewKitchenOrder(' + (parseInt(item.id, 10) || 0) + ')">View Order</button>' +
                                (isReady ? '' : '<button type="button" class="btn btn-primary" onclick="markKitchenReady(' + (parseInt(item.id, 10) || 0) + ')">Ready for Delivery</button>') +
                            '</div>' +
                        '</div>' +
                    '</article>';
            }

            if (!list.length) {
                html += '<div class="kitchen-empty">' + (kitchenActiveTab === 'ready' ? 'No orders are ready for delivery yet.' : 'No active queue orders.') + '</div>';
            }

            html += '</div>';
            if ($content.length) {
                $content.html(html);
            }
        },
        error: function () {
            kitchenOrders = [];
            if ($content.length) {
                $content.html(
                    '<div class="kitchen-tabs">' +
                        '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'queue' ? ' active' : '') + '" onclick="openKitchenTab(\'queue\')">Queue <span class="kitchen-tab-count">0</span></button>' +
                        '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'ready' ? ' active' : '') + '" onclick="openKitchenTab(\'ready\')">Ready for Delivery <span class="kitchen-tab-count">0</span></button>' +
                    '</div>' +
                    '<div class="kitchen-grid">' +
                        '<div class="kitchen-empty">' + (kitchenActiveTab === 'ready' ? 'No orders are ready for delivery yet.' : 'No active queue orders.') + '</div>' +
                    '</div>'
                );
            }
            showToast('Unable to load kitchen queue orders.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showKitchenLoader(false);
        }
    });
}

function formatKitchenDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (isNaN(date.getTime())) {
        return String(value);
    }

    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function escapeKitchenHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
}