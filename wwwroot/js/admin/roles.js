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

    // preserve matrix search behavior (debounced)
    $rolesSearch.on('keyup', debounce(function () {
        var value = $(this).val().toLowerCase();
        $rolesMatrix.find('tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }, 250));

    // Open roles management modal when Add Role button is clicked
    $(document).on('click', '.page-header .btn.btn-orange', function () {
        openRolesModal();
    });

    // modal bindings (delegated)
    $(document).on('click', '#rolesModal .modal-close', function () { $('#rolesModal').addClass('hidden'); });
    $(document).on('click', '#btnClearRole', clearRoleForm);
    $(document).on('click', '#btnSaveRole', saveRole);
});

function openRolesModal() {
        if ($('#rolesModal').length) {
                $('#rolesModal').removeClass('hidden');
                loadRolesForModal();
        } else {
                showToast('Roles modal not present in page. Ensure Roles.cshtml contains the modal markup.');
        }
}

function loadRolesForModal() {
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
                <td>${active ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn btn-light btn-xs" onclick="editRole('${id}')">Edit</button>
                    <button class="btn btn-danger btn-xs" onclick="deleteRole('${id}')">Delete</button>
                    <button class="btn btn-primary btn-xs" onclick="toggleActive('${id}')">Toggle Active</button>
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
    $('#roleIsActive').prop('checked', true);
}

function saveRole() {
    var role = {
        Id: $('#roleId').val() || '',
        Code: $('#roleCode').val() || '',
        Name: $('#roleName').val() || '',
        Remarks: $('#roleRemarks').val() || '',
        IsActive: $('#roleIsActive').is(':checked') ? '1' : '0',
        IsDeleted: '0'
    };

    $.ajax({
        url: '/Admin/Roles/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(role),
        success: function (res) {
            showToast(res && res.success ? 'Saved' : 'Unable to save');
            clearRoleForm();
            loadRolesForModal();
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
            $('#roleIsActive').prop('checked', (role.IsActive === '1' || role.IsActive === 'true' || role.isActive === '1' || role.isActive === 'true'));
            $('#rolesModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load role'); }
    });
}

function deleteRole(id) {
    if (!confirm('Delete role?')) return;
    $.ajax({
        url: '/Admin/Roles/delete/' + id,
        type: 'POST',
        success: function (res) {
            showToast(res && res.success ? 'Deleted' : 'Unable to delete');
            loadRolesForModal();
        },
        error: function () { showToast('Delete failed'); }
    });
}

function toggleActive(id) {
    $.ajax({
        url: '/Admin/Roles/activeinactive/' + id,
        type: 'POST',
        success: function (res) {
            showToast(res && res.success ? 'Updated active state' : 'Unable to update');
            loadRolesForModal();
        },
        error: function () { showToast('Request failed'); }
    });
}