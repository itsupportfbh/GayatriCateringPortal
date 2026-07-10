$(document).ready(function () {
   
    // Load role list on initial page open
    loadCustomers();
      
});


function loadCustomers() {
    
    $.ajax({
        url: '/Admin/Customers/getAll',
        type: 'GET',
        success: function (rows) {
          
            renderCustomerList(rows || []);
        },
        error: function () {
            renderCustomerList([]);
        }
    });
}

function renderCustomerList(rows) {
    rows = Array.isArray(rows) ? rows : [];

    var html = rows.map(function (customer, index) {

        var serial = index + 1;

        var id = customer.id ?? customer.Id ?? 0;
        var code = customer.code ?? customer.Code ?? '';
        var name = customer.name ?? customer.Name ?? '';
        var mobile = customer.mobileNo ?? customer.mobileNo ?? '';
        var email = customer.emailId ?? customer.emailId ?? '';
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
    $('#customerCompanyName').val('');
    $('#customerAddressLine1').val('');
    $('#customerAddressLine2').val('');
    $('#customerCityId').val('');
    $('#customerCode').val('');
    $('#customerStateId').val('');
    $('#customerCountryId').val('');
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
        CompanyName: $('#customerCompanyName').val() || '',
        AddressLine1: $('#customerAddressLine1').val() || '',
        AddressLine2: $('#customerAddressLine2').val() || '',
        CityId: parseInt($('#customerCityId').val()) || 0,
        StateId: parseInt($('#customerStateId').val()) || 0,
        CountryId: parseInt($('#customerCountryId').val()) || 0,
        Pincode: $('#customerPincode').val() || '',
        DateOfBirth: $('#customerDateOfBirth').val() || null,
        Gender: parseInt($('#customerGender').val()) || null,
        Remarks: $('#customerRemarks').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 1,
        CreatedDate: new Date().toISOString(),
        UpdatedBy: null,
        UpdatedDate: null
    };
   

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
                showToast(res?.message || 'Unable to save Customer.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function (xhr) {
            showToast(xhr.responseJSON?.message || 'Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}


function editCustomer(id) {

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
            $('#customerCompanyName').val(customer.CompanyName || customer.companyName || '');
            $('#customerAddressLine1').val(customer.AddressLine1 || customer.addressLine1 || '');
            $('#customerAddressLine2').val(customer.AddressLine2 || customer.addressLine2 || '');
            $('#customerCityId').val(customer.CityId || customer.cityId || '');
            $('#customerStateId').val(customer.StateId || customer.stateId || '');
            $('#customerCountryId').val(customer.CountryId || customer.countryId || '');
            $('#customerPincode').val(customer.Pincode || customer.pincode || '');

            var dob = customer.DateOfBirth || customer.dateOfBirth || '';
            $('#customerDateOfBirth').val(dob ? dob.substring(0, 10) : '');

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
    debugger;
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







  
