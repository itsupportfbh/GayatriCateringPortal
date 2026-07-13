$(document).ready(function () {
    loadUsers();
});

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
    initUserField('#userPassword', '#userPasswordError');
    
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
            <button type="button" class="action-item btn-toggle" data-id="${id}" data-state="${isActive ? 'active' : 'inactive'}" onclick="toggleUserStatus(this.dataset.id, ${isActive ? 'false' : 'true'})"><span class="action-icon p-p-${isActive ? 'lock' : 'unlock'}"></span>${isActive ? 'Inactive' : 'Active'}</button>`;

        html += `
            <tr data-id="${id}">
                <td>${serial}</td>
                <td>${code}</td>
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
    $('#userPassword').val('');
    $('#userRemarks').val('');
    $('#userIsAdmin').prop('checked', false);
    clearUserError('#userCode', '#userCodeError');
    clearUserError('#userName', '#userNameError');
    clearUserError('#userEmail', '#userEmailError');
    clearUserError('#userPassword', '#userPasswordError');
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
            $('#userPassword').val(user.Password || user.password || '');
            $('#userRemarks').val(user.Remarks || user.remarks || '');
            $('#userIsAdmin').prop('checked', user.IsAdmin || user.isAdmin || false);
            
            initUserField('#userCode', '#userCodeError');
            initUserField('#userName', '#userNameError');
            initUserField('#userEmail', '#userEmailError');
            initUserField('#userPassword', '#userPasswordError');

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
    clearUserError('#userPassword', '#userPasswordError');

    var firstInvalid = null;
    var code = $('#userCode').val().toString().trim();
    var name = $('#userName').val().toString().trim();
    var email = $('#userEmail').val().toString().trim();
    var password = $('#userPassword').val();
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

    if (!userId && !password) {
        setUserError('#userPassword', '#userPasswordError', 'Password is required');
        if (!firstInvalid) firstInvalid = '#userPassword';
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
    var user = {
        Id: userId ? parseInt(userId) : 0,
        Code: $('#userCode').val().trim(),
        Name: $('#userName').val().trim(),
        Email: $('#userEmail').val().trim(),
        Password: $('#userPassword').val(),
        ContactNo: $('#userContact').val() || '',
        Remarks: $('#userRemarks').val() || '',
        IsAdmin: $('#userIsAdmin').prop('checked'),
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 0,
        UpdatedBy: 0
    };

    var isUpdate = userId && parseInt(userId) > 0;
    var endpoint = isUpdate ? '/Admin/Users/update' : '/Admin/Users/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function (res) {
            if (res && res.success) {
                showToast(isUpdate ? 'User updated successfully.' : 'User created successfully.', 3000, { type: 'success', title: isUpdate ? 'Updated' : 'Created' });
                clearUsersForm();
                $('#usersModal').addClass('hidden');
                loadUsers();
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

function toggleUserStatus(id, isActive) {
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
