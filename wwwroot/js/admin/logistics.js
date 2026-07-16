$(document).ready(function () {
    loadPendingOrder();
});

function loadPendingOrder() {
    //showlogiLoader(true);

    $.ajax({
        url: '/Admin/Logistics/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderLogisList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderLogisList([]);
            showToast('Unable to load Logistics.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showlogiLoader(false);
        }
    });
}

function loadDelivered() {
    //showlogiLoader(true);

    $.ajax({
        url: '/Admin/Logistics/getDelivered',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderLogisDelList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderLogisDelList([]);
            showToast('Unable to load Logistics.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showlogiLoader(false);
        }
    });
}

function showlogiLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#commsListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
} 
function renderLogisList(rows) {

    let html = "";

    rows.forEach(function (item, index) {

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.createdDate ?? ""}</td>
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.customerId ?? ""}</td>
           <td>${item.deliveryAddress ?? ""}</td>

            <td>
                <select class="form-select driver"
                        id="driver_${item.id}">
                    <option value="">Select Driver</option>
                    <option value="David">David</option>
                    <option value="Kevin">Kevin</option>
                    <option value="Alex">Alex</option>
                </select>
            </td>

            <td>
                <span class="badge bg-warning">
                    Pending
                </span>
            </td>

            <td>
                <button class="btn btn-success btn-sm"
                        onclick="assignDelivery(${item.id})">
                    Assign
                </button>
            </td>
        </tr>`;
    });

    $("#PendingTable tbody").html(html);
}

function renderLogisDelList(rows) {

    let html = "";

    rows.forEach(function (item, index) {

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.createdDate ?? ""}</td>
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.customerId ?? ""}</td>
            <td>${item.deliveryAddress ?? ""}</td> 
        </tr>`;
    });

    $("#DeliveredTable tbody").html(html);
}
function assignDelivery(id) {

    var location = $("#location_" + id).val();
    var driver = $("#driver_" + id).val();

    if (location.trim() == "") {
        showToast("Please enter delivery location.");
        return;
    }

    if (driver == "") {
        showToast("Please select a driver.");
        return;
    }

    $.ajax({
        url: "/Admin/Logistics/update",
        type: "POST",
        data: {
            id: id,
            location: location,
            driverName: driver
        },
        success: function () {
            showToast("Assigned successfully.");
            loadPendingOrder();
        },
        error: function () {
            showToast("Assignment failed.");
        }
    });
}

$(function () {

    $("#btnPending").click(function () {

        $(".delivery-tab").removeClass("active");
        $(this).addClass("active");

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

        $(".delivery-tab").removeClass("active");
        $(this).addClass("active");

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