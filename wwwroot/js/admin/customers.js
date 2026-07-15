$(document).ready(function () {
    bindCustomerAgeFromDob();
    loadCustomers();
});

function calculateAgeFromDateValue(dateValue) {
    if (!dateValue) return '';

    var dob = new Date(dateValue + 'T00:00:00');
    if (isNaN(dob.getTime())) return '';

    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 0 ? age : '';
}

function syncCustomerAgeFromDob() {
    var age = calculateAgeFromDateValue($('#customerDateOfBirth').val());
    $('#customerAge').val(age === '' ? '' : String(age));
}

function bindCustomerAgeFromDob() {
    $('#customerAge').prop('disabled', true);
    $('#customerDateOfBirth').off('change.customerage input.customerage').on('change.customerage input.customerage', syncCustomerAgeFromDob);
}

function loadCustomerCountries(selectedCountryId) {
    return $.ajax({
        url: '/Common/GetCountry',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">--Select Country--</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#customerCountryId').html(html);

            if (selectedCountryId) {
                $('#customerCountryId').val(selectedCountryId.toString());
            }

            $('#customerCountryId').off('change.location').on('change.location', function () {
                var countryId = parseInt($(this).val(), 10) || 0;
                $('#customerStateId').html('<option value="0">--Select State--</option>');
                $('#customerCityId').html('<option value="0">--Select City--</option>');

                if (countryId > 0) {
                    loadCustomerStatesByCountryId(countryId);
                }
            });
        },
        error: function () {
            $('#customerCountryId').html('<option value="0">--Select Country--</option>');
            showToast('Unable to load countries.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadCustomerStatesByCountryId(countryId, selectedStateId) {
    if (!countryId) {
        $('#customerStateId').html('<option value="0">--Select State--</option>');
        $('#customerCityId').html('<option value="0">--Select City--</option>');
        return $.Deferred().resolve().promise();
    }

    return $.ajax({
        url: '/Common/GetStateByCountryId?countryId=' + parseInt(countryId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">--Select State--</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#customerStateId').html(html);

            if (selectedStateId) {
                $('#customerStateId').val(selectedStateId.toString());
            }

            $('#customerStateId').off('change.location').on('change.location', function () {
                var stateId = parseInt($(this).val(), 10) || 0;
                $('#customerCityId').html('<option value="0">--Select City--</option>');

                if (stateId > 0) {
                    loadCustomerCitiesByStateId(stateId);
                }
            });
        },
        error: function () {
            $('#customerStateId').html('<option value="0">--Select State--</option>');
            showToast('Unable to load states.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadCustomerCitiesByStateId(stateId, selectedCityId) {
    if (!stateId) {
        $('#customerCityId').html('<option value="0">--Select City--</option>');
        return $.Deferred().resolve().promise();
    }

    return $.ajax({
        url: '/Common/GetCityByStateId?stateId=' + parseInt(stateId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">--Select City--</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#customerCityId').html(html);

            if (selectedCityId) {
                $('#customerCityId').val(selectedCityId.toString());
            }
        },
        error: function () {
            $('#customerCityId').html('<option value="0">--Select City--</option>');
            showToast('Unable to load cities.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}


function loadCustomers() {
    showCustomersLoader(true);

    $.ajax({
        url: '/Admin/Customers/getAll',
        type: 'GET',
        success: function (rows) {
            renderCustomerList(rows || []);
        },
        error: function () {
            renderCustomerList([]);
            showToast('Unable to load customers.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showCustomersLoader(false);
        }
    });
}

function showCustomersLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#customersListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
    }
}

function renderCustomerList(rows) {
    rows = Array.isArray(rows) ? rows : [];

    var html = rows.map(function (customer, index) {

        var serial = index + 1;

        var id = customer.id ?? customer.Id ?? 0;
        var code = customer.code ?? customer.Code ?? '';
        var name = customer.name ?? customer.Name ?? '';
        var mobile = customer.mobileNo ?? customer.MobileNo ?? '';
        var email = customer.emailId ?? customer.EmailId ?? '';
        var remarks = customer.remarks ?? customer.Remarks ?? '';
        var active = customer.isActive ?? customer.IsActive ?? false;


        var actions;
        if (active) {
            actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editCustomer(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setCustomerActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
        } else {
            actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setCustomerActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
        }

        var statusBadge;
        if (active) {
            statusBadge = '<span class="badge-pill badge-pill--success">Active</span>';
        } else {
            statusBadge = '<span class="badge-pill badge-pill--warning">Inactive</span>';
        }
                

        return `
            <tr>
                <td>${serial}</td>
                <td>${code}</td>
                <td>${name}</td>
                <td>${mobile}</td>
                <td>${email}</td>
                <td>${remarks}</td>
                <td>${statusBadge}</td>
                <td>
                <div class="row-actions">
                <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteCustomer(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
                               
                            </div>
                        </div>
                        </td>
            </tr>`;
    }).join('');

    $('#customerList tbody').html(html);

    if (typeof renderDataTable === 'function') {
        renderDataTable('customerList');
    }
}

function clearCustomerForm() {
    $('#customerId').val('');
    $('#customerCode').val('');
    $('#customerName').val('');
    $('#customerMobileNo').val('');
    $('#customerEmailId').val('');
    $('#customerAge').val('');
    $('#customerAddressLine1').val('');
    $('#customerAddressLine2').val('');
    $('#customerCountryId').html('<option value="0">--Select Country--</option>');
    $('#customerStateId').html('<option value="0">--Select State--</option>');
    $('#customerCityId').html('<option value="0">--Select City--</option>');
    $('#customerPincode').val('');
    $('#customerDateOfBirth').val('');
    $('#customerGender').val('');
    $('#customerRemarks').val('');
}
function closeCustomerModal() {
    $('#customersModal').addClass('hidden');
}

function openCustomerModal() {
    clearCustomerForm();
    bindCustomerAgeFromDob();
    loadCustomerCountries();
    $('#customers-title').text('Create Customer');
    // hideRolePermission();
    $('#customersModal').removeClass('hidden');
}
function saveCustomer() {
    var customer = {
        Id: parseInt($('#customerId').val()) || 0,
        Code: $('#customerCode').val() || '',
        Name: $('#customerName').val() || '',
        MobileNo: $('#customerMobileNo').val() || '',
        EmailId: $('#customerEmailId').val() || '',
        Age: parseInt($('#customerAge').val(), 10) || null,
        AddressLine1: $('#customerAddressLine1').val() || '',
        AddressLine2: $('#customerAddressLine2').val() || '',
        CityId: parseInt($('#customerCityId').val(), 10) || 0,
        StateId: parseInt($('#customerStateId').val(), 10) || 0,
        CountryId: parseInt($('#customerCountryId').val(), 10) || 0,
        Pincode: $('#customerPincode').val() || '',
        DateOfBirth: $('#customerDateOfBirth').val() || null,
        Gender: parseInt($('#customerGender').val()) || null,
        Remarks: $('#customerRemarks').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        CreatedDate: new Date().toISOString(),
        UpdatedBy: null,
        UpdatedDate: null
    };

    setButtonBusy('button[onclick="saveCustomer()"]', true, 'Saving...');
   

    var endpoint = customer.Id ? '/Admin/Customers/update' : '/Admin/Customers/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(customer),
        success: function (res) {
            if (res && res.success) {
                showToast(res.message || 'Customer saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearCustomerForm();
                $('#customersModal').addClass('hidden');
                loadCustomers();
            } else {
                setButtonBusy('button[onclick="saveCustomer()"]', false);
                showToast(res?.message || 'Unable to save Customer.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function (xhr) {
            setButtonBusy('button[onclick="saveCustomer()"]', false);
            showToast(xhr.responseJSON?.message || 'Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}


function editCustomer(id) {
    bindCustomerAgeFromDob();
    $('#customers-title').text('Edit Customer');

    $.ajax({
        url: '/Admin/Customers/get/' + id,
        type: 'GET',
        success: function (customer) {
            if (!customer) {
                showToast('Customer not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }

            $('#customerId').val(customer.Id || customer.id || '');
            $('#customerCode').val(customer.Code || customer.code || '');
            $('#customerName').val(customer.Name || customer.name || '');
            $('#customerMobileNo').val(customer.MobileNo || customer.mobileNo || '');
            $('#customerEmailId').val(customer.EmailId || customer.emailId || '');
            $('#customerAddressLine1').val(customer.AddressLine1 || customer.addressLine1 || '');
            $('#customerAddressLine2').val(customer.AddressLine2 || customer.addressLine2 || '');

            var selectedCountryId = parseInt(customer.CountryId || customer.countryId, 10) || 0;
            var selectedStateId = parseInt(customer.StateId || customer.stateId, 10) || 0;
            var selectedCityId = parseInt(customer.CityId || customer.cityId, 10) || 0;

            $('#customerStateId').html('<option value="0">--Select State--</option>');
            $('#customerCityId').html('<option value="0">--Select City--</option>');

            loadCustomerCountries(selectedCountryId).done(function () {
                if (!selectedCountryId) return;

                loadCustomerStatesByCountryId(selectedCountryId, selectedStateId).done(function () {
                    if (!selectedStateId) return;
                    loadCustomerCitiesByStateId(selectedStateId, selectedCityId);
                });
            });
            $('#customerPincode').val(customer.Pincode || customer.pincode || '');

            var dob = customer.DateOfBirth || customer.dateOfBirth || '';
            $('#customerDateOfBirth').val(dob ? dob.substring(0, 10) : '');
            syncCustomerAgeFromDob();

            var customerAge = customer.Age ?? customer.age ?? '';
            if (customerAge !== '' && customerAge !== null && !isNaN(parseInt(customerAge, 10))) {
                $('#customerAge').val(parseInt(customerAge, 10));
            }

            $('#customerGender').val(customer.Gender || customer.gender || '');
            $('#customerRemarks').val(customer.Remarks || customer.remarks || '');

            $('#customersModal').removeClass('hidden');
        },
        error: function () {
            showToast('Unable to load customer.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}
function setCustomerActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Customer active?' : 'Mark this Customer inactive?';
    var successMessage = isActive ? 'Customer activated.' : 'Customer marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Customers/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Customer status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadCustomers, 350);
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


function deleteCustomer(id) {
    if (!id) return;
    showToast('Delete this Customer?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Customers/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Customer deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Customer.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadCustomers, 300);
                },
                error: function () { showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' }); }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}







  
