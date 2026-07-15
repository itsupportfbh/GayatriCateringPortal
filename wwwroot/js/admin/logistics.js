$(function () {
    var fallbackData = [
        { id: 'ORD-001', customer: 'Priya S', event: 'Wedding', date: '2025-08-15', driver: 'Kumar', vehicle: 'SBA1234A' },
        { id: 'ORD-002', customer: 'Ravi M', event: 'Corporate', date: '2025-07-20', driver: 'Selvam', vehicle: 'SBB5678B' }
    ];

    loadDispatch();

    function loadDispatch() {
        $.get('/Admin/Logistics/get').done(render).fail(function () {
            render(fallbackData);
        });
    }

    function render(data) {
        var t = $('#logisticsTable tbody');
        t.empty();
        (data || []).forEach(function (r) {
            var id = r.id || r.Id || '';
            t.append('<tr><td>' + id + '</td><td>' + (r.customer || r.Customer || '') + '</td><td>' + (r.event || r.Event || '') + '</td><td>' + (r.date || r.Date || '') + '</td><td>' + (r.driver || r.Driver || '') + '</td><td>' + (r.vehicle || r.Vehicle || '') + '</td><td><span class="badge badge-dispatch">Dispatch</span></td><td><button class="btn btn-primary btn-xs" onclick="markDelivered(\'' + id + '\')">Mark Delivered</button></td></tr>');
        });
    }
    window.markDelivered = function (id) { showToast('Order ' + id + ' delivered'); };
});

$(function () {

    $("#btnPending").click(function () {

        $("#pendingSection").show();
        $("#deliveredSection").hide();

        $("#btnPending")
            .removeClass("btn-outline-warning")
            .addClass("btn-warning");

        $("#btnDelivered")
            .removeClass("btn-success")
            .addClass("btn-outline-success");

    });

    $("#btnDelivered").click(function () {

        $("#pendingSection").hide();
        $("#deliveredSection").show();

        $("#btnDelivered")
            .removeClass("btn-outline-success")
            .addClass("btn-success");

        $("#btnPending")
            .removeClass("btn-warning")
            .addClass("btn-outline-warning");

    });

});