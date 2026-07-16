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

function showlogiLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#commsListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

//function renderLogisList(rows) {
//    rows = Array.isArray(rows) ? rows : [];
//    var html = '';
//    if (rows.length) {
//        html = rows.map(function (logis) {0
//            var id = logis.id || logis.Id || '';
//            var Channel = logis.orderNumber || logis.OrderNumber || '';
//            var ToAddress = logis.customerId || logis.CustomerId || '';
//            var Message = logis.message || logis.Message || '';
//            var active = logis.isActive;

//            var actions;
//            if (active) {
//                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editComms(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
//                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setCommsActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
//            } else {
//                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setCommsActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
//            }

//            var statusBadge;
//            if (active) {
//                statusBadge = '<span class="badge-pill badge-pill--success">Active</span>';
//            } else {
//                statusBadge = '<span class="badge-pill badge-pill--warning">Inactive</span>';
//            }

//            return `
//                <tr>
//                    <td>${id}</td>
//                    <td>${Channel}</td>
//                    <td>${ToAddress}</td>
//                    <td>${Message || ''}</td>
//                    <td>${statusBadge}</td>
//                    <td>
//                        <div class="row-actions">
//                            <button class="dots-btn" title="Actions">⋯</button>
//                            <div class="actions-menu hidden">
//                                ${actions}
//                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteComms(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
//                            </div>
//                        </div>
//                    </td>
//                </tr>`;
//        }).join('');
//    }

//    $('#commsList tbody').html(html);
//    if (typeof renderDataTable === 'function') {
//        renderDataTable('commsList');
//    }
//}

function renderLogisList(rows) {

    let html = "";

    rows.forEach(function (item, index) {

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.orderDate ?? ""}</td>
            <td>${item.orderNumber ?? ""}</td>
            <td>${item.customerName ?? ""}</td>

            <td>
                <input type="text"
                       class="form-control location"
                       id="location_${item.id}"
                       placeholder="Delivery Location">
            </td>

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
        url: "/Admin/Logistics/Assign",
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