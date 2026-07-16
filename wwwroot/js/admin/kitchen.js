var kitchenOrders = [];
var kitchenActiveTab = 'queue';

$(function () {
    kitchenOrders = [
        {
            id: 'GC-2026-001',
            customer: 'Ravi Kumar',
            date: '2026-07-01',
            period: 'LUNCH',
            packageName: 'Non-Vegetarian Indian Buffet',
            pax: 80,
            location: 'Tanjong Pagar',
            stage: 'queue'
        },
        {
            id: 'GC-2026-002',
            customer: 'Priya Events',
            date: '2026-07-05',
            period: 'DINNER',
            packageName: 'Premium North Indian Feast',
            pax: 120,
            location: 'Orchard',
            stage: 'queue'
        }
    ];

    renderKitchenQueue(kitchenOrders);

    $(document)
        .off('click.kitchenStage')
        .on('click.kitchenStage', '.kitchen-tab', function () {
            var tab = ($(this).data('tab') || '').toString().toLowerCase();
            if (!tab) return;
            kitchenActiveTab = tab;
            renderKitchenQueue(kitchenOrders);
        })
        .off('click.kitchenDispatch')
        .on('click.kitchenDispatch', '.kitchen-ready-btn', function () {
            var orderId = $(this).data('orderId');
            setKitchenOrderStage(orderId, 'ready');
            kitchenActiveTab = 'ready';
            showToast('Order marked ready for delivery.', 2200, { type: 'success', title: 'Updated' });
        })
        .off('click.kitchenView')
        .on('click.kitchenView', '.kitchen-view-btn', function () {
            showToast('Order details page will be connected soon.', 2200, { type: 'info', title: 'View Order' });
        });
});

function setKitchenOrderStage(orderId, stage) {
    var validStages = { queue: true, ready: true };
    if (!orderId || !validStages[stage]) return;

    for (var i = 0; i < kitchenOrders.length; i++) {
        var item = kitchenOrders[i] || {};
        if (String(item.id || '') === String(orderId)) {
            item.stage = stage;
            break;
        }
    }

    renderKitchenQueue(kitchenOrders);
}

function renderKitchenQueue(orders) {
    var list = Array.isArray(orders) ? orders : [];
    var $content = $('#kitchenContent');
    if (!$content.length) return;

    var queueCount = 0;
    var readyCount = 0;
    for (var c = 0; c < list.length; c++) {
        var s = String((list[c] && list[c].stage) || '').toLowerCase();
        if (s === 'ready') readyCount++;
        else queueCount++;
    }

    var html = '' +
        '<div class="kitchen-tabs">' +
            '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'queue' ? ' active' : '') + '" data-tab="queue">Queue <span class="kitchen-tab-count">' + queueCount + '</span></button>' +
            '<button type="button" class="kitchen-tab' + (kitchenActiveTab === 'ready' ? ' active' : '') + '" data-tab="ready">Ready for Delivery <span class="kitchen-tab-count">' + readyCount + '</span></button>' +
        '</div>' +
        '<div class="kitchen-grid">';

    var shown = 0;
    var showReady = kitchenActiveTab === 'ready';

    for (var i = 0; i < list.length; i++) {
        var item = list[i] || {};
        var itemStage = String(item.stage || '').toLowerCase();
        var isReady = itemStage === 'ready';
        if ((showReady && isReady) || (!showReady && !isReady)) {
            html += buildKitchenCard(item);
            shown++;
        }
    }

    if (!shown) {
        html += '<div class="kitchen-empty">' + (showReady ? 'No orders are ready for delivery yet.' : 'No active queue orders.') + '</div>';
    }

    html += '</div>';
    $content.html(html);
}

function buildKitchenCard(order) {
    var stage = String(order.stage || '').toLowerCase();
    var isReady = stage === 'ready';

    return '' +
        '<article class="kitchen-order-card' + (isReady ? ' is-ready' : '') + '">' +
            '<div class="kitchen-order-main">' +
                '<div class="kitchen-order-top">' +
                    '<div class="kitchen-order-date">' + escapeKitchenHtml(order.date || '') + ' - ' + escapeKitchenHtml(order.period || '') + '</div>' +
                    '<span class="kitchen-order-id">' + escapeKitchenHtml(order.id || '') + '</span>' +
                '</div>' +
                '<h3 class="kitchen-order-title">' + escapeKitchenHtml(order.customer || '') + '</h3>' +
                '<p class="kitchen-order-meta">' + escapeKitchenHtml(order.packageName || '') + '</p>' +
                '<div class="kitchen-order-facts">' +
                    '<span class="kitchen-fact-chip">' + escapeKitchenHtml(order.pax || '') + ' pax</span>' +
                    '<span class="kitchen-fact-chip">' + escapeKitchenHtml(order.location || '') + '</span>' +
                '</div>' +
                (isReady ? '<div class="kitchen-ready-pill">Ready for Delivery</div>' : '') +
            '</div>' +
            '<div class="kitchen-card-actions' + (isReady ? ' ready-actions' : '') + '">' +
                '<button type="button" class="btn btn-light kitchen-view-btn" data-order-id="' + escapeKitchenHtml(order.id || '') + '">View Order</button>' +
                (isReady
                    ? ''
                    : '<button type="button" class="btn btn-primary kitchen-ready-btn" data-order-id="' + escapeKitchenHtml(order.id || '') + '">Ready for Delivery</button>') +
            '</div>' +
        '</article>';
}

function escapeKitchenHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
}