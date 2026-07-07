$(document).ready(function () {
    var $rolesSearch = $('#rolesSearch');
    var $rolesMatrix = $('#rolesMatrix');
    var $rolesListBody = $('#rolesList tbody');

    // debounce helper
    function debounce(fn, delay) {
        var t;
        return function () {
            var args = arguments;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(null, args); }, delay);
        };
    }

    // preserve roles list search behavior (debounced)
    $rolesSearch.on('keyup', debounce(function () {
        var value = $(this).val().toLowerCase();
        $('#rolesList tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }, 250));

    // Load role list on initial page open
    loadRoles();

    // Open create/edit popup when Add Role is clicked
    $(document).on('click', '#btnOpenRoleModal', function () {
        hideRolePermission();
        clearRoleForm();
        $('#rolesModal').removeClass('hidden');
    });

    $(document).on('click', '#btnClearRole', clearRoleForm);
    $(document).on('click', '#btnSaveRole', saveRole);
    $(document).on('click', '#rolesModal .modal-close', function () { $('#rolesModal').addClass('hidden'); });
    $(document).on('click', '#btnBackToRoles', hideRolePermission);
    $(document).on('click', '.btn-edit', function () { editRole($(this).data('id')); });
    $(document).on('click', '.btn-delete', function () { deleteRole($(this).data('id')); });
    $(document).on('click', '.btn-set-active', function () { setRoleActive($(this).data('id'), true); });
    $(document).on('click', '.btn-set-inactive', function () { setRoleActive($(this).data('id'), false); });
    $(document).on('click', '.btn-role-permission', function () {
        var $this = $(this);
        showRolePermission($this.data('id'), $this.data('code'));
    });
});

function openRolesModal() {
    clearRoleForm();
    hideRolePermission();
    $('#rolesModal').removeClass('hidden');
}

function loadRoles() {
    $.ajax({
        url: '/Admin/Roles/get',
        type: 'GET',
        success: function (rows) {
            renderRolesList(rows || []);
        },
        error: function () {
            renderRolesList([]);
        }
    });
}

function renderRolesList(rows) {
    if (!rows || !rows.length) {
        return; // keep static rows when no backend data is available
    }

    var html = rows.map(function (role) {
        var id = role.id || role.Id || '';
        var code = role.code || role.Code || '';
        var name = role.name || role.Name || '';
        var remarks = role.remarks || role.Remarks || '';
        var active = role.isActive === '1' || role.isActive === 'true' || role.IsActive === '1' || role.IsActive === 'true';
        return `
            <tr>
                <td>${id}</td>
                <td>${code}</td>
                <td>${name}</td>
                <td>${remarks || ''}</td>
                <td>${active ? 'Active' : 'Inactive'}</td>
                <td>
                    <div class="row-actions">
                        <button class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">
                            <button class="action-item btn-edit" data-id="${id}"><span class="action-icon p-p-pencil"></span>Edit</button>
                            <button class="action-item btn-delete" data-id="${id}"><span class="action-icon p-p-trash"></span>Delete</button>
                            <button class="action-item btn-set-active ${active ? 'disabled' : ''}" data-id="${id}" ${active ? 'disabled' : ''}><span class="action-icon p-p-unlock"></span>Active</button>
                            <button class="action-item btn-set-inactive ${active ? '' : 'disabled'}" data-id="${id}" ${active ? '' : 'disabled'}><span class="action-icon p-p-lock"></span>Inactive</button>
                            <button class="action-item btn-role-permission" data-id="${id}" data-code="${code}"><span class="action-icon p-p-cog"></span>Role Permission</button>
                        </div>
                    </div>
                </td>
            </tr>`;
    }).join('');
    $('#rolesList tbody').html(html);
}

function clearRoleForm() {
    $('#roleId').val('');
    $('#roleCode').val('');
    $('#roleName').val('');
    $('#roleRemarks').val('');
}

function saveRole() {
    debugger;
    var role = {
        Id: $('#roleId').val() || '',
        Code: $('#roleCode').val() || '',
        Name: $('#roleName').val() || '',
        Remarks: $('#roleRemarks').val() || '',
        IsActive: '1',
        IsDeleted: '0',
        CreatedBy: '',
        CreatedDate: '',
        UpdatedBy: '',
        UpdatedDate: ''
    };

    $.ajax({
        url: '/Admin/Roles/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(role),
        success: function (res) {
            showToast(res && res.success ? 'Saved' : 'Unable to save');
            clearRoleForm();
            $('#rolesModal').addClass('hidden');
            loadRoles();
        },
        error: function () {
            showToast('Save failed');
        }
    });
}

function editRole(id) {
    $.ajax({
        url: '/Admin/Roles/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) return showToast('Role not found');
            $('#roleId').val(role.Id || role.id || '');
            $('#roleCode').val(role.Code || role.code || '');
            $('#roleName').val(role.Name || role.name || '');
            $('#roleRemarks').val(role.Remarks || role.remarks || '');
            hideRolePermission();
            $('#rolesModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load role'); }
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
    if (!confirm('Delete role?')) return;
    $.ajax({
        url: '/Admin/Roles/delete/' + id,
        type: 'POST',
        success: function (res) {
            showToast(res && res.success ? 'Deleted' : 'Unable to delete');
            loadRoles();
        },
        error: function () { showToast('Delete failed'); }
    });
}

function setRoleActive(id, isActive) {
    if (!id) return;
    // The backend endpoint currently toggles the state.
    // Only call it when the requested state differs from current row state.
    $.ajax({
        url: '/Admin/Roles/activeinactive/' + id,
        type: 'POST',
        success: function (res) {
            showToast(res && res.success ? 'Updated active state' : 'Unable to update');
            loadRoles();
        },
        error: function () { showToast('Request failed'); }
    });
}

function toggleActive(id) {
    setRoleActive(id, null);
}