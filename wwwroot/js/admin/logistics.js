$(document).ready(function () {    
    loadDriverMaster(function () {
        loadPendingOrder();
        loadDelivered();
    });
});

var driverMaster = [];

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
            <td>${item.createdDate}</td>
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.customerName ?? ""}</td>
           <td>${item.deliveryAddress ?? ""}</td>

            <td>
                <select class="form-select driver"
        id="driver_${item.id}">
    ${getDriverDropdown(item.driverId)}
</select>
            </td>

            <td>
                <span class="badge bg-warning">
                    Pending
                </span>
            </td>

            <td>
                <button class="btn btn-success btn-sm"
                        onclick="assignDelivery(
    ${item.id},
    '${item.createdDate ?? ""}',
    '${item.orderNumber ?? ""}',
    '${item.deliveryAddress ?? ""}'
)">
                    Assign
                </button>
            </td>
        </tr>`;
    });

    $("#PendingTable tbody").html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('PendingTable');
    }
}

function loadDriverMaster(callback) {
    $.ajax({
        url: '/Admin/Driver/get',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            driverMaster = res || [];

            if (callback) {
                callback();
            }
        },
        error: function () {
            showToast('Unable to load drivers.', 3000,
                { type: 'error', title: 'Error' });
        }
    });
}

function getDriverDropdown(selectedDriverId) {

    var options = '<option value="">Select Driver</option>';

    $.each(driverMaster, function (i, driver) {

        options += `<option value="${driver.id}"
                        ${driver.id == selectedDriverId ? 'selected' : ''}>
                        ${driver.code} - ${driver.name}
                    </option>`;
    });

    return options;
}

function renderLogisDelList(rows) {

    let html = "";

    rows.forEach(function (item, index) {

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.createdDate ?? ""}</td>
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.status ?? ""}</td>
            <td>${item.location ?? ""}</td> 
            <td>${item.driverName ?? ""}</td> 
        </tr>`;
    });

    $("#DeliveredTable tbody").html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('DeliveredTable');
    }
}
function assignDelivery(id, OrderDate, OrderNumber, DeliveryAddress) {

    var driver = $("#driver_" + id).val();  

    if (driver == "") {
        showToast("Please select a driver.");
        return;
    }

    var Logistics = {
        Id: id ? parseInt(id) : 0,
        OrderDate: OrderDate,
        OrderNumber: OrderNumber,
        Location: DeliveryAddress,
        DriverName: driver,
        Status: '',        
        IsActive: true,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,        
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0        
    };

    $.ajax({
        url: "/Admin/Logistics/Create",
        type: "POST",        
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Logistics),
        success: function (response) {           
            if (response.success) {
                showToast(response.message, 3000, {
                    type: "success",
                    title: "Success"
                });
                loadPendingOrder();
            } else {
                showToast(response.message, 3000, {
                    type: "warning",
                    title: "Warning"
                });
            }
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
        $("#pendingsearch").show();
        $("#deliveredSection").hide();
        $("#deliverysearch").hide();

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
        $("#pendingsearch").hide();
        $("#deliveredSection").show();
        $("#deliverysearch").show();

        $("#btnDelivered")
            .removeClass("btn-outline-success")
            .addClass("btn-success");

        $("#btnPending")
            .removeClass("btn-warning")
            .addClass("btn-outline-warning");

    });

});