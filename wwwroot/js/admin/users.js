var allUsers = [];

$(document).ready(function () {
    bindUsersSearch();
    loadUsers();
});

function bindUsersSearch() {
    $('#usersSearch').off('input.users').on('input.users', function () {
        applyUsersFilter($(this).val());
    });
}

function applyUsersFilter(searchText) {
    var term = (searchText || '').toLowerCase().trim();
    if (!term) {
        renderUsersList(allUsers);
        return;
    }

    var filtered = allUsers.filter(function (u) {
        var code = String(u.code || u.Code || '').toLowerCase();
        var name = String(u.name || u.Name || '').toLowerCase();
        var email = String(u.email || u.Email || '').toLowerCase();
        var contact = String(u.contactNo || u.ContactNo || '').toLowerCase();
        return code.indexOf(term) > -1 || name.indexOf(term) > -1 || email.indexOf(term) > -1 || contact.indexOf(term) > -1;
    });

    renderUsersList(filtered);
}

function loadCountries(selectedCountryId) {
    return $.ajax({
        url: '/Common/GetCountry',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">Select country</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
          
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#userCountry').html(html);

            if (selectedCountryId) {
                $('#userCountry').val(selectedCountryId.toString());
            }

            $('#userCountry').off('change.location').on('change.location', function () {
                var countryId = parseInt($(this).val(), 10) || 0;
                $('#userState').html('<option value="0">Select state</option>');
                $('#userCity').html('<option value="0">Select city</option>');
                if (countryId > 0) {
                    loadStatesByCountryId(countryId);
                }
            });
        },
        error: function () {
            $('#userCountry').html('<option value="0">Select country</option>');
            showToast('Unable to load countries.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadStatesByCountryId(countryId, selectedStateId) {
    if (!countryId) {
        $('#userState').html('<option value="0">Select state</option>');
        $('#userCity').html('<option value="0">Select city</option>');
        return $.Deferred().resolve().promise();
    }

    return $.ajax({
        url: '/Common/GetStateByCountryId?countryId=' + parseInt(countryId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">Select state</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
              
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#userState').html(html);

            if (selectedStateId) {
                $('#userState').val(selectedStateId.toString());
            }

            $('#userState').off('change.location').on('change.location', function () {
                var stateId = parseInt($(this).val(), 10) || 0;
                $('#userCity').html('<option value="0">Select city</option>');
                if (stateId > 0) {
                    loadCitiesByStateId(stateId);
                }
            });
        },
        error: function () {
            $('#userState').html('<option value="0">Select state</option>');
            showToast('Unable to load states.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadCitiesByStateId(stateId, selectedCityId) {
    if (!stateId) {
        $('#userCity').html('<option value="0">Select city</option>');
        return $.Deferred().resolve().promise();
    }

    return $.ajax({
        url: '/Common/GetCityByStateId?stateId=' + parseInt(stateId, 10),
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '<option value="0">Select city</option>';

            for (var i = 0; i < list.length; i++) {
                var row = list[i] || {};
               
                html += '<option value="' + row.id + '">' + (row.name || '') + '</option>';
            }

            $('#userCity').html(html);

            if (selectedCityId) {
                $('#userCity').val(selectedCityId.toString());
            }
        },
        error: function () {
            $('#userCity').html('<option value="0">Select city</option>');
            showToast('Unable to load cities.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

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

    $roles.off('change.roles').on('change.roles', function () {
        clearRolesError();
    });
}

function setRolesError(message) {
    $('#userRolesError').removeClass('hidden').text(message || 'Roles is required');
    $('#usersModal .select2-container--default .select2-selection--multiple').addClass('input-error');
}

function clearRolesError() {
    $('#userRolesError').addClass('hidden').text('');
    $('#usersModal .select2-container--default .select2-selection--multiple').removeClass('input-error');
}

function normalizeRoleIds(roleIds) {
    var ids = Array.isArray(roleIds) ? roleIds : [];
    return ids
        .map(function (x) { return parseInt(x, 10); })
        .filter(function (x) { return !isNaN(x) && x > 0; });
}

function loadUserRolesOptions(selectedRoleIds) {
    var selected = normalizeRoleIds(selectedRoleIds);
    var selectedMap = {};
    for (var i = 0; i < selected.length; i++) {
        selectedMap[selected[i]] = true;
    }

    $.ajax({
        url: '/Admin/Roles/get',
        type: 'GET',
        dataType: 'json',
        success: function (roles) {
            var list = Array.isArray(roles) ? roles : [];
            var activeRoles = list.filter(function (r) {
                return r.isActive !== false;
            });

            var html = '';
            for (var j = 0; j < activeRoles.length; j++) {
                var role = activeRoles[j];
                var id = parseInt(role.id || role.Id, 10);
                if (isNaN(id)) continue;

                var text = (role.name || role.Name || '') + ' (' + (role.code || role.Code || '') + ')';
                var selectedAttr = selectedMap[id] ? ' selected' : '';
                html += '<option value="' + id + '"' + selectedAttr + '>' + text + '</option>';
            }

            $('#userRoles').html(html);
            initUserRolesDropdown();
            $('#userRoles').trigger('change.select2');
        },
        error: function () {
            $('#userRoles').html('');
            initUserRolesDropdown();
            $('#userRoles').trigger('change.select2');
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
        loadUserRolesOptions([]);
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
            loadUserRolesOptions(roleIds);
        },
        error: function () {
            loadUserRolesOptions([]);
        }
    });
}

function saveUserRoleMappings(userId, roleIds, isUpdate, emailStatus) {
    var ids = Array.isArray(roleIds) ? roleIds : [];
    if (!ids.length) {
        setButtonBusy('#saveUserBtn', false);
        showToast('Select at least one role.', 3000, { type: 'error', title: 'Validation' });
        return;
    }

    var payload = ids.map(function (roleId) {
        return {
            UserId: userId,
            RoleId: roleId,
            IsActive: true,
            IsDeleted: false,
            CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
            UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0
        };
    });

    $.ajax({
        url: '/Admin/UserRoleMapping/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
            if (res && res.success) {
                if (!isUpdate && emailStatus && emailStatus.sent === false) {
                    showToast('User created successfully, but welcome email failed: ' + (emailStatus.error || 'Unknown mail error.'), 5000, { type: 'warning', title: 'Mail not sent' });
                } else {
                    showToast(isUpdate ? 'User updated successfully.' : 'User created successfully.', 3000, { type: 'success', title: isUpdate ? 'Updated' : 'Created' });
                }
                clearUsersForm();
                $('#usersModal').addClass('hidden');
                loadUsers();
                setButtonBusy('#saveUserBtn', false);
            } else {
                setButtonBusy('#saveUserBtn', false);
                showToast('User saved, but role mapping failed.', 3000, { type: 'error', title: 'Role mapping failed' });
            }
        },
        error: function () {
            setButtonBusy('#saveUserBtn', false);
            showToast('User saved, but role mapping failed.', 3000, { type: 'error', title: 'Role mapping failed' });
        }
    });
}

function bindUserImageUpload() {
    $('#userImageFile').off('change').on('change', function () {
        var file = this.files && this.files[0] ? this.files[0] : null;
        if (!file) {
            updateUserImageViewButton();
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var imageData = e && e.target ? e.target.result : '';
            if (imageData) {
                $('#userImagePreview').attr('src', imageData).removeClass('hidden');
            } else {
                $('#userImagePreview').attr('src', '').addClass('hidden');
            }

            updateUserImageViewButton();
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

function buildUserImageUrl(imageValue) {
    if (!imageValue) return '';

    var value = String(imageValue).trim();
    if (!value) return '';

    if (value.indexOf('data:') === 0 || value.indexOf('http://') === 0 || value.indexOf('https://') === 0 || value.indexOf('/FileUpload/') === 0) {
        return value;
    }

    return '/FileUpload/User/' + value;
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

function getCurrentUserImageUrl() {
    var previewSrc = $('#userImagePreview').attr('src') || '';
    if (previewSrc) {
        return previewSrc;
    }

    return buildUserImageUrl($('#userImage').val() || '');
}

function updateUserImageViewButton() {
    var imageUrl = getCurrentUserImageUrl();
    $('#btnViewUserImage').toggleClass('hidden', !imageUrl);
}

function openUserImageInNewTab(imageUrl) {
    if (!imageUrl) {
        showToast('No user image available.', 3000, { type: 'warning', title: 'Image not found' });
        return;
    }

    window.open(imageUrl, '_blank', 'noopener,noreferrer');
}

function viewCurrentUserImage() {
    openUserImageInNewTab(getCurrentUserImageUrl());
}

function syncUserAgeFromDob() {
    var age = calculateAgeFromDateValue($('#userDob').val());
    $('#userAge').val(age === '' ? '' : String(age));
}

function bindDobAgeAutoCalc() {
    $('#userAge').prop('disabled', true);
    $('#userDob').off('change.userage input.userage').on('change.userage input.userage', syncUserAgeFromDob);
}

function setUserDobValue(dateValue) {
    var val = toDateInputValue(dateValue);
    var dobInput = document.getElementById('userDob');

    if (dobInput && dobInput._flatpickr) {
        if (val) dobInput._flatpickr.setDate(val, true, 'Y-m-d');
        else dobInput._flatpickr.clear();
    } else {
        $('#userDob').val(val);
    }

    syncUserAgeFromDob();
}

function closeUsersModal() {
    $('#usersModal').addClass('hidden');
}

function openUsersModal() {
    bindUserImageUpload();
    bindDobAgeAutoCalc();
    loadUserRolesOptions([]);

    clearUsersForm();
    $('#users-title').html('Create User');
    $('#usersModal').removeClass('hidden');

    initUserField('#userCode', '#userCodeError');
    initUserField('#userName', '#userNameError');
    initUserField('#userEmail', '#userEmailError');

    loadCountries();

    setActionButtonLabel('#saveUserBtn', 'Save');
}

function loadUsers() {
    showUsersLoader(true);

    $.ajax({
        url: '/Admin/Users/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            allUsers = Array.isArray(rows) ? rows : [];
            applyUsersFilter($('#usersSearch').val());
        },
        error: function () {
            allUsers = [];
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
        $('#usersCardsWrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderUsersList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';

    for (var i = 0; i < rows.length; i++) {
        var u = rows[i];
        var code = u.code || '';
        var name = u.name || '';
        var email = u.email || '';
        var contact = u.contactNo || '';
        var isAdmin = u.isAdmin;
        var isActive = u.isActive;
        var id = u.id || 0;
        var imageValue = u.image || u.Image || '';
        var imageUrl = buildUserImageUrl(imageValue);
        var imageCell = imageUrl
            ? '<div class="user-list-image-cell"><img src="' + imageUrl + '" alt="' + (name || 'User') + '" class="user-list-image" /></div>'
            : '<div class="user-list-image user-list-image-placeholder">' + ((name || '?').charAt(0).toUpperCase()) + '</div>';

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
            <div class="user-card" data-id="${id}">
                <div class="user-card-top">
                    <div class="user-card-profile">${imageCell}</div>
                    <div class="user-card-title-wrap">
                        <div class="user-card-name">${name || '-'}</div>
                        <div class="user-card-code">${code || '-'}</div>
                    </div>
                    <div class="row-actions user-card-actions">
                        <button type="button" class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">${actions}</div>
                    </div>
                </div>
                <div class="user-card-tags">${statusBadge}${adminBadge}</div>
                <div class="user-card-meta-grid">
                    <div class="user-card-detail"><label>Email</label><div>${email || '-'}</div></div>
                    <div class="user-card-detail user-card-detail-inline"><label>Contact</label><div>${contact || '-'}</div></div>
                </div>
            </div>`;
    }

    $('#usersCards').html(html);
    $('#usersCardsEmpty').toggleClass('hidden', rows.length > 0);
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
        setActionButtonLabel('#saveUserBtn', 'Save');
    }
    $('#userCode').val('');
    $('#userName').val('');
    $('#userEmail').val('');
    $('#userContact').val('');
    $('#userRemarks').val('');
    $('#userCountry').html('<option value="0">--Select Country--</option>');
    $('#userState').html('<option value="0">--Select State--</option>');
    $('#userCity').html('<option value="0">--Select City--</option>');
    $('#userPostalCode').val('');
    $('#userAge').val('');
    $('#userGender').val('');
    $('#userAddress1').val('');
    $('#userAddress2').val('');
    $('#userImage').val('');
    $('#userImageFile').val('');
    $('#userIsActive').val('true');
    $('#userImagePreview').attr('src', '').addClass('hidden');
    updateUserImageViewButton();
    $('#userIsAdmin').prop('checked', false);
    loadUserRolesOptions([]);
    clearRolesError();
    setUserDobValue('');
    clearUserError('#userCode', '#userCodeError');
    clearUserError('#userName', '#userNameError');
    clearUserError('#userEmail', '#userEmailError');
}

function editUser(id) {
    bindUserImageUpload();
    bindDobAgeAutoCalc();

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
            $('#userId').val(user.id || 0);
            $('#userCode').val(user.code || '');
            $('#userName').val(user.name || '');
            $('#userEmail').val(user.email || '');
            $('#userContact').val(user.contactNo || '');
            $('#userRemarks').val(user.remarks || '');

            var selectedCountryId = parseInt(user.country, 10) || 0;
            var selectedStateId = parseInt(user.state, 10) || 0;
            var selectedCityId = parseInt(user.city, 10) || 0;

            $('#userState').html('<option value="0">--Select State--</option>');
            $('#userCity').html('<option value="0">--Select City--</option>');

            loadCountries(selectedCountryId).done(function () {
                if (!selectedCountryId) return;

                loadStatesByCountryId(selectedCountryId, selectedStateId).done(function () {
                    if (!selectedStateId) return;
                    loadCitiesByStateId(selectedStateId, selectedCityId);
                });
            });

            $('#userPostalCode').val(user.postalCode || '');
            setUserDobValue(user.dob);
            $('#userGender').val(user.gender || '');
            $('#userAddress1').val(user.address1 || '');
            $('#userAddress2').val(user.address2 || '');

            var imageValue = user.Image || user.image || '';
            $('#userImage').val(imageValue);
            if (imageValue) {
                $('#userImagePreview').attr('src', buildUserImageUrl(imageValue)).removeClass('hidden');
            } else {
                $('#userImagePreview').attr('src', '').addClass('hidden');
            }

            updateUserImageViewButton();

            $('#userImageFile').val('');
            $('#userIsAdmin').prop('checked', user.isAdmin || false);
            $('#userIsActive').val(((user.isActive) ? true : false).toString());

            var userId = user.id || 0;
            loadUserRoleMappings(userId);

            initUserField('#userCode', '#userCodeError');
            initUserField('#userName', '#userNameError');
            initUserField('#userEmail', '#userEmailError');

            $('#usersModal').removeClass('hidden');
            setActionButtonLabel('#saveUserBtn', 'Update');
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
    clearRolesError();

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
        setRolesError('Select at least one role');
        if (!firstInvalid) firstInvalid = '#userRoles';
    }

    if (firstInvalid) {
        if (firstInvalid === '#userRoles') {
            $('#userRoles').select2('open');
        } else {
            $(firstInvalid).focus();
        }
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

    setButtonBusy('#saveUserBtn', true, 'Saving...');

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
        Gender: parseInt($('#userGender').val(), 10) || null,
        Address1: $('#userAddress1').val() || '',
        Address2: $('#userAddress2').val() || '',
        Image: $('#userImage').val() || '',
        IsAdmin: $('#userIsAdmin').prop('checked'),
        IsActive: isActive,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0
    };

    var endpoint = isUpdate ? '/Admin/Users/update' : '/Admin/Users/create';
    var formData = new FormData();

    Object.keys(user).forEach(function (key) {
        var value = user[key];
        if (value === null || typeof value === 'undefined') {
            return;
        }

        formData.append(key, value);
    });

    var imageFileInput = document.getElementById('userImageFile');
    var imageFile = imageFileInput && imageFileInput.files && imageFileInput.files.length ? imageFileInput.files[0] : null;
    if (imageFile) {
        formData.append('ImageFile', imageFile);
    }

    $.ajax({
        url: endpoint,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res && res.success) {
                var savedUserId = isUpdate ? parseInt(userId, 10) : parseInt(res.id, 10);
                if (!savedUserId || isNaN(savedUserId)) {
                    setButtonBusy('#saveUserBtn', false);
                    showToast('User saved, but invalid user id for role mapping.', 3000, { type: 'error', title: 'Role mapping failed' });
                    return;
                }

                saveUserRoleMappings(savedUserId, selectedRoles, isUpdate, {
                    sent: res.emailSent !== false,
                    error: res.emailError || ''
                });
            } else {
                setButtonBusy('#saveUserBtn', false);
                var errorMsg = res && res.message ? res.message : (isUpdate ? 'Unable to update user.' : 'Unable to create user.');
                showToast(errorMsg, 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#saveUserBtn', false);
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
