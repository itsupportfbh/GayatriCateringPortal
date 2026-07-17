$(document).ready(function () {
    loadDriver();
});

function closeDriverModal() {
    $('#driverModal').addClass('hidden');
}

function opendriverModal() {
    clearDriverForm();
    $('#menu-title').text('Create Driver');
    setActionButtonLabel('#btnSaveDriver', 'Save');
    $('#driverModal').removeClass('hidden');

    initCategoryField('#ItemCode', '#ItemCodeError');
    initCategoryField('#ItemName', '#ItemNameError');
    initCategoryField('#MobileNo', '#MobileNoError');
    initCategoryField('#Email', '#EmailError');
    initCategoryField('#LicenseNo', '#LicenseNoError');
    initCategoryField('#LicenseExpiryDate', '#LicenseExpiryDateError');
    initCategoryField('#DateofBirth', '#DateofBirthError');
    initCategoryField('#Gender', '#GenderError');
    initCategoryField('#Address', '#AddressError');
    initCategoryField('#City', '#CityError');
    initCategoryField('#State', '#StateError');
    initCategoryField('#Pincode', '#PincodeError');
    initCategoryField('#VehicleType', '#VehicleTypeError');
    initCategoryField('#VehicleNo', '#VehicleNoError');
    initCategoryField('#ExperienceYears', '#ExperienceYearsError');
    initCategoryField('#JoiningDate', '#JoiningDateError');
}

function loadDriver() {
    showDriverLoader(true);

    $.ajax({
        url: '/Admin/Driver/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderDriverList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderDriverList([]);
            showToast('Unable to load Driver.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showDriverLoader(false);
        }
    });
}
function showDriverLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#menusListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderDriverList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';
    if (rows.length) {
        html = rows.map(function (driver) {
            var id = driver.id || driver.Id || '';
            var code = driver.code || driver.Code || '';
            var name = driver.name || driver.Name || '';
            var MobileNo = driver.mobileNo || driver.MobileNo || '';
            var Email = driver.email || driver.Email || '';
            var active = driver.isActive;

            var actions;
            if (active) {
                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editDriver(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setDriverActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
            } else {
                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setDriverActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
            }

            var statusBadge;
            if (active) {
                statusBadge = '<span class="badge-pill badge-pill--success">Active</span>';
            } else {
                statusBadge = '<span class="badge-pill badge-pill--warning">Inactive</span>';
            }

            return `
                <tr>
                    <td>${id}</td>
                    <td>${code}</td>
                    <td>${name}</td>
                    <td>${MobileNo || ''}</td>
                    <td>${Email || ''}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteDriver(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    $('#driverList tbody').html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('driverList');
    }
}

function clearDriverForm() {
    $('#menuId').val('');
    $('#Code').val('');
    $('#Name').val('');
    $('#MobileNo').val('');
    $('#Email').val('');
    $('#LicenseNo').val('')
    $('#LicenseExpiryDate').val('');
    $('#DateofBirth').val('');
    $('#Gender').val('');
    $('#Address').val('');
    $('#City').val('');
    $('#State').val('');
    $('#Pincode').val('');
    $('#VehicleType').val('');
    $('#VehicleNo').val('');
    $('#ExperienceYears').val('');
    $('#JoiningDate').val('');
    setActionButtonLabel('#btnSaveDriver', 'Save');

    clearDriverError('#Code', '#CodeError');
    clearDriverError('#Name', '#NameError');
    clearDriverError('#MobileNo', '#MobileNoError');
    clearDriverError('#Email', '#EmailError');
    clearDriverError('#LicenseNo', '#LicenseNoError');
    clearDriverError('#LicenseExpiryDate', '#LicenseExpiryDateError');
    clearDriverError('#DateofBirth', '#DateofBirthError');
    clearDriverError('#Gender', '#GenderError');
    clearDriverError('#Address', '#AddressError');
    clearDriverError('#City', '#CityError');
    clearDriverError('#State', '#StateError');
    clearDriverError('#Pincode', '#PincodeError');
    clearDriverError('#VehicleType', '#VehicleTypeError');
    clearDriverError('#VehicleNo', '#VehicleNoError');
    clearDriverError('#ExperienceYears', '#ExperienceYearsError');
    clearDriverError('#JoiningDate', '#JoiningDateError');
}

function setDriverError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearDriverError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}

function initCategoryField(inputSelector, errorSelector) {
    clearDriverError(inputSelector, errorSelector);
    var el = document.querySelector(inputSelector);
    if (el) {
        el.oninput = function () {
            clearDriverError(inputSelector, errorSelector);
        };
    }
}

function validateForm() {
    clearDriverError('#Code', '#CodeError');
    clearDriverError('#Name', '#NameError');
    clearDriverError('#MobileNo', '#MobileNoError');
    clearDriverError('#Email', '#EmailError');
    clearDriverError('#LicenseNo', '#LicenseNoError');
    clearDriverError('#LicenseExpiryDate', '#LicenseExpiryDateError');
    clearDriverError('#DateofBirth', '#DateofBirthError');
    clearDriverError('#Gender', '#GenderError');
    clearDriverError('#Address', '#AddressError');
    clearDriverError('#City', '#CityError');
    clearDriverError('#State', '#StateError');
    clearDriverError('#Pincode', '#PincodeError');
    clearDriverError('#VehicleType', '#VehicleTypeError');
    clearDriverError('#VehicleNo', '#VehicleNoError');
    clearDriverError('#ExperienceYears', '#ExperienceYearsError');
    clearDriverError('#JoiningDate', '#JoiningDateError');


    var code = $('#Code').val();
    if (code) {
        code = code.toString().trim();
    } else {
        code = '';
    }

    var name = $('#Name').val();
    if (name) {
        name = name.toString().trim();
    } else {
        name = '';
    }

    var MobileNo = $('#MobileNo').val();
    if (MobileNo) {
        MobileNo = MobileNo.toString().trim();
    } else {
        MobileNo = '';
    }

    var firstInvalid = null;

    if (!code) {
        setDriverError('#Code', '#CodeError', 'Code is required');
        firstInvalid = '#Code';
    }

    if (!name) {
        setDriverError('#Name', '#NameError', 'Name is required');
        if (!firstInvalid) {
            firstInvalid = '#Name';
        }
    }

    if (!MobileNo) {
        setDriverError('#MobileNo', '#MobileNoError', 'MobileNo is required');
        if (!firstInvalid) {
            firstInvalid = '#MobileNo';
        }
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}

function saveDriver() {
    if (!validateForm()) {
        return;
    }

    setButtonBusy('#btnSaveDriver', true, 'Saving...');

    var DriverId = $('#driverId').val();
    var driver = {
        Id: DriverId ? parseInt(DriverId) : 0,
        Code: $('#Code').val() || '',
        Name: $('#Name').val() || '',
        MobileNo: $('#MobileNo').val() || '',
        Email: $('#Email').val() || '',
        LicenseNo: $('#LicenseNo').val() || null,
        LicenseExpiryDate: $('#LicenseExpiryDate').val() || null,
        DateofBirth: $('#DateofBirth').val() || null,
        Gender: $('#Gender').val() || null,
        Address: $('#Address').val() || null,
        City: $('#City').val() || null,
        State: $('#State').val() || null,
        Pincode: $('#Pincode').val() || null,
        VehicleType: $('#VehicleType').val() || null,
        VehicleNo: $('#VehicleNo').val() || null,
        ExperienceYears: $('#ExperienceYears').val()
            ? parseInt($('#ExperienceYears').val())
            : null,
        JoiningDate: $('#JoiningDate').val() || null,
        IsActive: true,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
    };

    var endpoint = driver.Id ? '/Admin/Driver/update' : '/Admin/Driver/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(driver),
        success: function (res) {
            if (res && res.success) {
                showToast('Driver saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearDriverForm();
                $('#driverModal').addClass('hidden');
                loadDriver();
            } else {
                setButtonBusy('#btnSaveDriver', false);
                showToast('Unable to save Menus.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#btnSaveDriver', false);
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editDriver(id) {
    $('#menu-title').text('Edit Driver');
    $.ajax({
        url: '/Admin/Driver/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) {
                showToast('Driver not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }

            $('#driverId').val(role.Id || role.id || '');
            $('#Code').val(role.Code || role.code || '');
            $('#Name').val(role.Name || role.name || '');
            $('#MobileNo').val(role.MobileNo || role.mobileNo || '');
            $('#Email').val(role.Email || role.email || '');
            $('#Gender').val(role.Gender || role.gender || '');            
            setActionButtonLabel('#btnSaveDriver', 'Update');
            $('#driverModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load Driver.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}

function deleteDriver(id) {
    if (!id) return;
    showToast('Delete this Driver?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Driver/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Driver deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Driver.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadDriver, 300);
                },
                error: function () { showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' }); }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}

function setDriverActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Driver active?' : 'Mark this Driver inactive?';
    var successMessage = isActive ? 'Driver activated.' : 'Driver marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Driver/activeinactive/' + id + '?status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Driver status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadDriver, 350);
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