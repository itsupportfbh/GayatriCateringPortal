$(document).ready(function () {
    loadRoles();
});

function closeRolesModal() {
    $('#rolesModal').addClass('hidden');
}

function openRolesModal() {
    clearRoleForm();
    hideRolePermission();
    $('#rolesModal').removeClass('hidden');
}

function loadRoles() {
    showRolesLoader(true);

    $.ajax({
        url: '/Admin/Roles/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderRolesList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderRolesList([]);
            showToast('Unable to load roles.', 3000, { type: 'error', title: 'Load failed' });
        },
            complete: function () {
                showRolesLoader(false);
            }
    });
}

function showRolesLoader(show) {
    // prefer the page-specific id, but accept the shared class names too
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#rolesListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderRolesList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';
    if (rows.length) {
        html = rows.map(function (role) {
            var id = role.id || role.Id || '';
            var code = role.code || role.Code || '';
            var name = role.name || role.Name || '';
            var remarks = role.remarks || role.Remarks || '';
            var active = role.isActive;

            var actions;
            if (active) {
                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editRole(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setRoleActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
            } else {
                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setRoleActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
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
                    <td>${remarks || ''}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteRole(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
                                <button type="button" class="action-item btn-role-permission" data-id="${id}" data-code="${code}" onclick="showRolePermission(this.dataset.id, this.dataset.code)"><span class="action-icon p-p-cog"></span>Role Permission</button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    $('#rolesList tbody').html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('rolesList');
    }
}

function clearRoleForm() {
    $('#roleId').val('');
    $('#roleCode').val('');
    $('#roleName').val('');
    $('#roleRemarks').val('');
}

function saveRole() {
    var role = {
        Id: $('#roleId').val() || '',
        Code: $('#roleCode').val() || '',
        Name: $('#roleName').val() || '',
        Remarks: $('#roleRemarks').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: '',
        CreatedDate: '',
        UpdatedBy: '',
        UpdatedDate: ''
    };

    var endpoint = role.Id ? '/Admin/Roles/update' : '/Admin/Roles/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(role),
        success: function (res) {
            if (res && res.success) {
                showToast('Role saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearRoleForm();
                $('#rolesModal').addClass('hidden');
                loadRoles();
            } else {
                showToast('Unable to save role.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editRole(id) {
    $.ajax({
        url: '/Admin/Roles/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) {
                showToast('Role not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }
            $('#roleId').val(role.Id || role.id || '');
            $('#roleCode').val(role.Code || role.code || '');
            $('#roleName').val(role.Name || role.name || '');
            $('#roleRemarks').val(role.Remarks || role.remarks || '');
            hideRolePermission();
            $('#rolesModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load role.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}

function showRolePermission(id, code) {
    $('#selectedRoleName').text(code || id || 'Unknown');
    $('#rolesListPanel').addClass('hidden');
    $('#rolesPermissionPanel').removeClass('hidden');
}

function hideRolePermission() {
    $('#rolesPermissionPanel').addClass('hidden');
    $('#rolesListPanel').removeClass('hidden');
}

function deleteRole(id) {
    if (!id) return;
    showToast('Delete this role?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Roles/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Role deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete role.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadRoles, 300);
                },
                error: function () { showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' }); }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}

function setRoleActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this role active?' : 'Mark this role inactive?';
    var successMessage = isActive ? 'Role activated.' : 'Role marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Roles/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update role status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadRoles, 350);
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

