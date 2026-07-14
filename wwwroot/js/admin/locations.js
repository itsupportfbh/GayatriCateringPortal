// Locations page - client-side rendering and actions


$(document).ready(function () {

    // Load role list on initial page open
    loadLocation();

});




function loadLocation() {
    showLocationsLoader(true);

    $.ajax({
        url: '/Admin/Locations/getAll',
        type: 'GET',
        success: function (rows) {

            renderLocationList(rows || []);
        },
        error: function () {
            renderLocationList([]);
            showToast('Unable to load locations.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showLocationsLoader(false);
        }
    });
}


function showLocationsLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#locationsListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
    }
}
function renderLocationList(rows) {
    rows = Array.isArray(rows) ? rows : [];

    var html = rows.map(function (location, index) {

        var serial = index + 1;

        var id = location.id ?? location.Id ?? 0;
        var code = location.code ?? location.Code ?? '';
        var locationName = location.locationName ?? location.LocationName ?? '';
        var deliveryFee = location.deliveryFee ?? location.DeliveryFee ?? 0;
        var minimumPax = location.minimumPax ?? location.MinimumPax ?? 0;
        var leadTimeDays = location.leadTimeDays ?? location.LeadTimeDays ?? 0;
        var remarks = location.remarks ?? location.Remarks ?? '';
        var active = location.isActive ?? location.IsActive ?? false;

        var actions;

        if (active) {
            actions = `
                <button type="button" class="action-item btn-edit" data-id="${id}" onclick="editLocation(this.dataset.id)">
                    <span class="action-icon p-p-pencil"></span>Edit
                </button>
                <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setLocationActive(this.dataset.id, false)">
                    <span class="action-icon p-p-lock"></span>Inactive
                </button>`;
        } else {
            actions = `
                <button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setLocationActive(this.dataset.id, true)">
                    <span class="action-icon p-p-unlock"></span>Active
                </button>`;
        }

        var statusBadge = active
            ? '<span class="badge-pill badge-pill--success">Active</span>'
            : '<span class="badge-pill badge-pill--warning">Inactive</span>';

        return `
            <tr>
                <td>${serial}</td>
                <td>${code}</td>
                <td>${locationName}</td>
                <td>${deliveryFee}</td>
                <td>${minimumPax}</td>
                <td>${leadTimeDays}</td>
                <td>${remarks}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="row-actions">
                        <button class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">
                            ${actions}
                            <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteLocation(this.dataset.id)">
                                <span class="action-icon p-p-trash"></span>Delete
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`;
    }).join('');

    $('#locationList tbody').html(html);

    if (typeof renderDataTable === 'function') {
        renderDataTable('locationList');
    }
}

function clearLocationForm() {
    $('#locationId').val('');
    $('#locationCode').val('');
    $('#locationName').val('');
    $('#locationDeliveryFee').val('');
    $('#locationMinimumPax').val('');
    $('#locationLeadTimeDays').val('');
    $('#locationRemarks').val('');
}


function closeLocationModal() {
    $('#locationsModal').addClass('hidden');
}


function openLocationModal() {
    clearLocationForm();

    $('#locationsModal').removeClass('hidden');
}
function saveLocation() {
    var location = {
        Id: parseInt($('#locationId').val()) || 0,
        Code: $('#locationCode').val() || '',
        LocationName: $('#locationName').val() || '',
        DeliveryFee: parseFloat($('#locationDeliveryFee').val()) || 0,
        MinimumPax: parseInt($('#locationMinimumPax').val()) || 0,
        LeadTimeDays: parseInt($('#locationLeadTimeDays').val()) || 0,
        Remarks: $('#locationRemarks').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 1,
        CreatedDate: new Date().toISOString(),
        UpdatedBy: null,
        UpdatedDate: null
    };

    var endpoint = location.Id ? '/Admin/Locations/update' : '/Admin/Locations/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(location),
        success: function (res) {
            if (res && res.success) {
                showToast(res.message || 'Location saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearLocationForm();
                $('#locationsModal').addClass('hidden');
                loadLocation();
            } else {
                showToast(res?.message || 'Unable to save Location.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function (xhr) {
            showToast(xhr.responseJSON?.message || 'Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}


function editLocation(id) {
    $.ajax({
        url: '/Admin/Locations/get/' + id,
        type: 'GET',
        success: function (location) {
            if (!location) {
                showToast('Location not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }

            $('#locationId').val(location.Id || location.id || '');
            $('#locationCode').val(location.Code || location.code || '');
            $('#locationName').val(location.LocationName || location.locationName || '');
            $('#locationDeliveryFee').val(location.DeliveryFee || location.deliveryFee || 0);
            $('#locationMinimumPax').val(location.MinimumPax || location.minimumPax || 0);
            $('#locationLeadTimeDays').val(location.LeadTimeDays || location.leadTimeDays || 0);
            $('#locationRemarks').val(location.Remarks || location.remarks || '');

            $('#locationsModal').removeClass('hidden');
        },
        error: function () {
            showToast('Unable to load location.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}


function setLocationActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Location active?' : 'Mark this Location inactive?';
    var successMessage = isActive ? 'Location activated.' : 'Location marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Locations/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Location status.', 3000, { type: 'error', title: 'Update failed' });
                    }

                    setTimeout(loadLocation, 350);
                },
                error: function () {
                    showToast('Request failed.', 3000, { type: 'error', title: 'Request failed' });
                }
            });
        },
        onNo: function () {
            showToast('Action cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}


function deleteLocation(id) {
    if (!id) return;

    showToast('Delete this Location?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Locations/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Location deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Location.', 3000, { type: 'error', title: 'Delete failed' });
                    }

                    setTimeout(loadLocation, 300);
                },
                error: function () {
                    showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' });
                }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}
































