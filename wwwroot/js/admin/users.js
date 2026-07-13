$(document).ready(function () {
    bindUserImageUpload();
    bindDobAgeAutoCalc();
    loadUserRolesOptions();
    loadUsers();
});

var userRolesCache = [];

function initUserRolesDropdown() {
    var $roles = $('#userRoles');
    if (!$roles.length || typeof $roles.select2 !== 'function') return;

    if (!$roles.hasClass('select2-hidden-accessible')) {
        $roles.select2({
            width: '100%',
            placeholder: $roles.data('placeholder') || 'Select roles',
            closeOnSelect: false,
            dropdownParent: $('#usersModal .modal-box')
        });
    }
}

function normalizeRoleIds(roleIds) {
    var ids = Array.isArray(roleIds) ? roleIds : [];
    return ids
        .map(function (x) { return parseInt(x, 10); })
        .filter(function (x) { return !isNaN(x) && x > 0; });
}

function renderUserRolesOptions(selectedRoleIds) {
    var selected = normalizeRoleIds(selectedRoleIds);
    var selectedMap = {};
    for (var i = 0; i < selected.length; i++) {
        selectedMap[selected[i]] = true;
    }

    var html = '';
    for (var j = 0; j < userRolesCache.length; j++) {
        var role = userRolesCache[j];
        var id = parseInt(role.id || role.Id, 10);
        if (isNaN(id)) continue;

        var text = (role.name || role.Name || '') + ' (' + (role.code || role.Code || '') + ')';
        var selectedAttr = selectedMap[id] ? ' selected' : '';
        html += '<option value="' + id + '"' + selectedAttr + '>' + text + '</option>';
    }

    $('#userRoles').html(html);
    initUserRolesDropdown();
    $('#userRoles').trigger('change.select2');
}

function loadUserRolesOptions(selectedRoleIds) {
    $.ajax({
        url: '/Admin/Roles/get',
        type: 'GET',
        dataType: 'json',
        success: function (roles) {
            var list = Array.isArray(roles) ? roles : [];
            userRolesCache = list.filter(function (r) {
                return (r.isActive !== undefined ? r.isActive : r.IsActive) !== false;
            });
            renderUserRolesOptions(selectedRoleIds);
        },
        error: function () {
            userRolesCache = [];
            renderUserRolesOptions(selectedRoleIds);
        }
    });
}

function getSelectedUserRoleIds() {
    return ($('#userRoles').val() || [])
        .map(function (x) { return parseInt(x, 10); })
        .filter(function (x) { return !isNaN(x) && x > 0; });
}

function loadUserRoleMappings(userId) {
    if (!userId || parseInt(userId, 10) <= 0) {
        renderUserRolesOptions([]);
        return;
    }

    $.ajax({
        url: '/Admin/UserRoleMapping/get?userId=' + parseInt(userId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var roleIds = list
                .map(function (x) { return parseInt(x.roleId || x.RoleId, 10); })
                .filter(function (x) { return !isNaN(x) && x > 0; });
            renderUserRolesOptions(roleIds);
        },
        error: function () {
            renderUserRolesOptions([]);
        }
    });
}

function saveUserRoleMappings(userId, roleIds, isUpdate) {
    var ids = Array.isArray(roleIds) ? roleIds : [];
    if (!ids.length) {
        showToast('Select at least one role.', 3000, { type: 'error', title: 'Validation' });
        return;
    }

    var payload = ids.map(function (roleId) {
        return {
            UserId: userId,
            RoleId: roleId,
            IsActive: true,
            IsDeleted: false,
            CreatedBy: 0,
            UpdatedBy: 0
        };
    });

    $.ajax({
        url: '/Admin/UserRoleMapping/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
            if (res && res.success) {
                showToast(isUpdate ? 'User updated successfully.' : 'User created successfully.', 3000, { type: 'success', title: isUpdate ? 'Updated' : 'Created' });
                clearUsersForm();
                $('#usersModal').addClass('hidden');
                loadUsers();
            } else {
                showToast('User saved, but role mapping failed.', 3000, { type: 'error', title: 'Role mapping failed' });
            }
        },
        error: function () {
            showToast('User saved, but role mapping failed.', 3000, { type: 'error', title: 'Role mapping failed' });
        }
    });
}

function bindUserImageUpload() {
    $('#userImageFile').off('change').on('change', function () {
        var file = this.files && this.files[0] ? this.files[0] : null;
        if (!file) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var imageData = e && e.target ? e.target.result : '';
            $('#userImage').val(imageData || '');
            if (imageData) {
                $('#userImagePreview').attr('src', imageData).removeClass('hidden');
            } else {
                $('#userImagePreview').attr('src', '').addClass('hidden');
            }
        };
        reader.readAsDataURL(file);
    });
}

function toDateInputValue(dateValue) {
    if (!dateValue) return '';
    var date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

function calculateAgeFromDateValue(dateValue) {
    var normalized = toDateInputValue(dateValue);
    if (!normalized) return '';

    var dob = new Date(normalized + 'T00:00:00');
    if (isNaN(dob.getTime())) return '';

    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age >= 0 ? age : '';
}

function syncUserAgeFromDob() {
    var dobValue = $('#userDob').val();
    var age = calculateAgeFromDateValue(dobValue);
    $('#userAge').val(age === '' ? '' : age.toString());
}

function bindDobAgeAutoCalc() {
    $('#userAge').prop('disabled', true);
    $('#userDob').off('change.userage input.userage').on('change.userage input.userage', function () {
        syncUserAgeFromDob();
    });
}

function setUserDobValue(dateValue) {
    var val = toDateInputValue(dateValue);
    var dobInput = document.getElementById('userDob');
    if (dobInput && dobInput._flatpickr) {
        if (val) {
            dobInput._flatpickr.setDate(val, true, 'Y-m-d');
        } else {
            dobInput._flatpickr.clear();
        }
        syncUserAgeFromDob();
        return;
    }

    $('#userDob').val(val);
    syncUserAgeFromDob();
}

function closeUsersModal() {
    $('#usersModal').addClass('hidden');
}

function openUsersModal() {
    clearUsersForm();
    $('#users-title').html('Create User');
    $('#usersModal').removeClass('hidden');

    initUserField('#userCode', '#userCodeError');
    initUserField('#userName', '#userNameError');
    initUserField('#userEmail', '#userEmailError');

    if (!userRolesCache.length) {
        loadUserRolesOptions([]);
    } else {
        renderUserRolesOptions([]);
    }
    
    $('#saveUserBtn').text('Save');
}

function loadUsers() {
    showUsersLoader(true);

    $.ajax({
        url: '/Admin/Users/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderUsersList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderUsersList([]);
            showToast('Unable to load users.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showUsersLoader(false);
        }
    });
}

function showUsersLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#usersListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderUsersList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';

    for (var i = 0; i < rows.length; i++) {
        var u = rows[i];
        var serial = i + 1;
        var code = u.code || '';
        var name = u.name || '';
        var email = u.email || '';
        var contact = u.contactNo || '';
        var isAdmin = u.isAdmin;
        var isActive = u.isActive;
        var id = u.id || 0;

        var adminBadge = isAdmin
            ? '<span class="badge badge-confirmed">Admin</span>'
            : '<span class="badge badge-cancelled">User</span>';

        var statusBadge = isActive
            ? '<span class="badge badge-confirmed">Active</span>'
            : '<span class="badge badge-cancelled">Inactive</span>';

        var actions = `
            <button type="button" class="action-item btn-edit" data-id="${id}" onclick="editUser(${id})"><span class="action-icon p-p-pencil"></span>Edit</button>
            <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteUser(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
            <button type="button" class="action-item btn-toggle" data-id="${id}" data-state="${isActive ? 'active' : 'inactive'}" onclick="setUserActive(this.dataset.id, ${isActive ? 'false' : 'true'})"><span class="action-icon p-p-${isActive ? 'lock' : 'unlock'}"></span>${isActive ? 'Inactive' : 'Active'}</button>`;

        html += `
            <tr data-id="${id}">
                <td>${serial}</td>
                <td><strong>${code}<strong></td>
                <td><strong>${name}</strong></td>
                <td>${email}</td>
                <td>${contact}</td>
                <td>${adminBadge}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="row-actions">
                        <button type="button" class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">
                            ${actions}
                        </div>
                    </div>
                </td>
            </tr>`;
    }

    $('#usersList tbody').html(html);

    if (typeof renderDataTable === 'function') {
        renderDataTable('usersList');
    }
}

function setUserError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearUserError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}

function initUserField(inputSelector, errorSelector) {
    clearUserError(inputSelector, errorSelector);
    $(inputSelector).on('input', function () {
        clearUserError(inputSelector, errorSelector);
    });
}

function clearUsersForm(keepId) {
    if (!keepId) {
        $('#userId').val('');
        $('#saveUserBtn').text('Save');
    }
    $('#userCode').val('');
    $('#userName').val('');
    $('#userEmail').val('');
    $('#userContact').val('');
    $('#userRemarks').val('');
    $('#userCountry').val('');
    $('#userState').val('');
    $('#userCity').val('');
    $('#userPostalCode').val('');
    $('#userAge').val('');
    $('#userAddress1').val('');
    $('#userAddress2').val('');
    $('#userImage').val('');
    $('#userImageFile').val('');
    $('#userIsActive').val('true');
    $('#userImagePreview').attr('src', '').addClass('hidden');
    $('#userIsAdmin').prop('checked', false);
    renderUserRolesOptions([]);
    setUserDobValue('');
    clearUserError('#userCode', '#userCodeError');
    clearUserError('#userName', '#userNameError');
    clearUserError('#userEmail', '#userEmailError');
}

function editUser(id) {
    $('#users-title').html('Edit User');

    $.ajax({
        url: '/Admin/Users/get/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (user) {
            if (!user) {
                showToast('User not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }
            $('#userId').val(user.Id || user.id || '');
            $('#userCode').val(user.Code || user.code || '');
            $('#userName').val(user.Name || user.name || '');
            $('#userEmail').val(user.Email || user.email || '');
            $('#userContact').val(user.ContactNo || user.contactNo || '');
            $('#userRemarks').val(user.Remarks || user.remarks || '');
            $('#userCountry').val((user.Country || user.country || '').toString());
            $('#userState').val((user.State || user.state || '').toString());
            $('#userCity').val((user.City || user.city || '').toString());
            $('#userPostalCode').val(user.PostalCode || user.postalCode || '');
            setUserDobValue(user.DOB || user.dob);
            $('#userAddress1').val(user.Address1 || user.address1 || '');
            $('#userAddress2').val(user.Address2 || user.address2 || '');

            var imageValue = user.Image || user.image || '';
            $('#userImage').val(imageValue);
            if (imageValue) {
                $('#userImagePreview').attr('src', imageValue).removeClass('hidden');
            } else {
                $('#userImagePreview').attr('src', '').addClass('hidden');
            }

            $('#userImageFile').val('');
            $('#userIsAdmin').prop('checked', user.IsAdmin || user.isAdmin || false);
            $('#userIsActive').val(((user.IsActive !== undefined ? user.IsActive : user.isActive) ? true : false).toString());

            var userId = user.Id || user.id || 0;
            if (!userRolesCache.length) {
                loadUserRolesOptions([]);
            }
            loadUserRoleMappings(userId);
            
            initUserField('#userCode', '#userCodeError');
            initUserField('#userName', '#userNameError');
            initUserField('#userEmail', '#userEmailError');

            $('#usersModal').removeClass('hidden');
            $('#saveUserBtn').text('Update');
        },
        error: function () {
            showToast('Unable to load user.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function validateUserForm() {
    clearUserError('#userCode', '#userCodeError');
    clearUserError('#userName', '#userNameError');
    clearUserError('#userEmail', '#userEmailError');

    var firstInvalid = null;
    var code = $('#userCode').val().toString().trim();
    var name = $('#userName').val().toString().trim();
    var email = $('#userEmail').val().toString().trim();
    var userId = $('#userId').val();

    if (!code) {
        setUserError('#userCode', '#userCodeError', 'Code is required');
        firstInvalid = '#userCode';
    }

    if (!name) {
        setUserError('#userName', '#userNameError', 'Name is required');
        if (!firstInvalid) firstInvalid = '#userName';
    }

    if (!email) {
        setUserError('#userEmail', '#userEmailError', 'Email is required');
        if (!firstInvalid) firstInvalid = '#userEmail';
    } else if (!isValidEmail(email)) {
        setUserError('#userEmail', '#userEmailError', 'Enter a valid email');
        if (!firstInvalid) firstInvalid = '#userEmail';
    }

    var selectedRoles = getSelectedUserRoleIds();
    if (!selectedRoles.length) {
        showToast('Select at least one role.', 3000, { type: 'error', title: 'Validation' });
        return false;
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveUser() {
    if (!validateUserForm()) {
        return;
    }

    var userId = $('#userId').val();
    var isUpdate = userId && parseInt(userId) > 0;
    var isActive = isUpdate ? ($('#userIsActive').val() === 'true') : true;
    var selectedRoles = getSelectedUserRoleIds();
    var user = {
        Id: userId ? parseInt(userId) : 0,
        Code: $('#userCode').val().trim(),
        Name: $('#userName').val().trim(),
        Email: $('#userEmail').val().trim(),
        ContactNo: $('#userContact').val() || '',
        Remarks: $('#userRemarks').val() || '',
        Country: parseInt($('#userCountry').val(), 10) || null,
        State: parseInt($('#userState').val(), 10) || null,
        City: parseInt($('#userCity').val(), 10) || null,
        PostalCode: parseInt($('#userPostalCode').val(), 10) || null,
        DOB: $('#userDob').val() || null,
        Age: parseInt($('#userAge').val(), 10) || null,
        Address1: $('#userAddress1').val() || '',
        Address2: $('#userAddress2').val() || '',
        Image: $('#userImage').val() || '',
        IsAdmin: $('#userIsAdmin').prop('checked'),
        IsActive: isActive,
        IsDeleted: false,
        CreatedBy: 0,
        UpdatedBy: 0
    };

    var endpoint = isUpdate ? '/Admin/Users/update' : '/Admin/Users/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (res) {
            if (res && res.success) {
                var savedUserId = isUpdate ? parseInt(userId, 10) : parseInt(res.id, 10);
                if (!savedUserId || isNaN(savedUserId)) {
                    showToast('User saved, but invalid user id for role mapping.', 3000, { type: 'error', title: 'Role mapping failed' });
                    return;
                }

                saveUserRoleMappings(savedUserId, selectedRoles, isUpdate);
            } else {
                var errorMsg = res && res.message ? res.message : (isUpdate ? 'Unable to update user.' : 'Unable to create user.');
                showToast(errorMsg, 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            showToast(isUpdate ? 'Update failed.' : 'Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function deleteUser(id) {
    if (!id) return;

    showToast('Delete this user?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Users/delete/' + id,
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (result && result.success) {
                        showToast('User deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete user.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadUsers, 300);
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

function setUserActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this user active?' : 'Mark this user inactive?';
    var successMessage = isActive ? 'User activated.' : 'User marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Users/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (result && result.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update user status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadUsers, 300);
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
