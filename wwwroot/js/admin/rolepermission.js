$(document).ready(function () {
    loadRolePermissionFunctions();
});

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function permissionCell() {
    return '<td><input type="checkbox"></td>';
}

function boolPermissionCell(cssClass) {
    return '<td><input type="checkbox" class="' + cssClass + '"></td>';
}

function buildRolePermissionRow(entityNo, functionName) {
    return '<tr data-entity-no="' + entityNo + '">' +
        '<td><strong>' + escapeHtml(functionName) + '</strong></td>' +
        boolPermissionCell('perm-view') +
        boolPermissionCell('perm-create') +
        boolPermissionCell('perm-edit') +
        boolPermissionCell('perm-delete') +
        boolPermissionCell('perm-activeinactive') +
        boolPermissionCell('perm-download') +
        boolPermissionCell('perm-print') +
        '</tr>';
}

function loadRolePermissionFunctions() {
    var roleId = parseInt($('#rolePermissionRoleId').val() || '0', 10);

    $.ajax({
        url: '/Common/GetEntityMaster',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            var html = '';

            if (!list.length) {
                html = '<tr><td colspan="8" class="muted">No functions found.</td></tr>';
            } else {
                for (var i = 0; i < list.length; i++) {
                    var row = list[i] || {};
                    var entityNo = row.entityNo || row.EntityNo || row.id || row.Id || 0;
                    var functionName = row.name || row.Name || '';
                    if (entityNo > 0) {
                        html += buildRolePermissionRow(entityNo, functionName);
                    }
                }
            }

            $('#rolesMatrixBody').html(html);
            if (typeof renderDataTable === 'function') {
                renderDataTable('rolesMatrix');
            }

            if (roleId > 0) {
                loadAndBindRolePermissions(roleId);
            }
        },
        error: function () {
            $('#rolesMatrixBody').html('<tr><td colspan="8" class="muted">Unable to load functions.</td></tr>');
            if (typeof renderDataTable === 'function') {
                renderDataTable('rolesMatrix');
            }
            showToast('Unable to load role permission functions.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadAndBindRolePermissions(roleId) {
    $.ajax({
        url: '/Common/GetRolePermissionsByRoleId?roleId=' + encodeURIComponent(roleId),
        type: 'GET',
        dataType: 'json'
    })
        .done(function (rows) {
            var list = Array.isArray(rows) ? rows : [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i] || {};
                var entityNo = item.entityNo || item.EntityNo || 0;
                if (!entityNo) {
                    continue;
                }

                var $row = $('#rolesMatrixBody tr[data-entity-no="' + entityNo + '"]');
                if (!$row.length) {
                    continue;
                }

                $row.find('.perm-view').prop('checked', !!(item.view || item.View));
                $row.find('.perm-create').prop('checked', !!(item.create || item.Create));
                $row.find('.perm-edit').prop('checked', !!(item.edit || item.Edit));
                $row.find('.perm-delete').prop('checked', !!(item.delete || item.Delete));
                $row.find('.perm-activeinactive').prop('checked', !!(item.activeInActive || item.ActiveInActive));
                $row.find('.perm-download').prop('checked', !!(item.download || item.Download));
                $row.find('.perm-print').prop('checked', !!(item.print || item.Print));
            }
        })
        .fail(function () {
            showToast('Unable to load saved permissions for this role.', 2500, { type: 'error', title: 'Load failed' });
        });
}

function saveRolePermissions() {
    var roleId = parseInt($('#rolePermissionRoleId').val() || '0', 10);
    if (!roleId || roleId <= 0) {
        showToast('Invalid role selected.', 2500, { type: 'error', title: 'Save failed' });
        return;
    }

    setButtonBusy('#btnSaveRolePermission', true, 'Saving...');

    var $rows = $('#rolesMatrixBody tr[data-entity-no]');
    if (!$rows.length) {
        setButtonBusy('#btnSaveRolePermission', false);
        showToast('No permission rows found to save.', 2500, { type: 'error', title: 'Save failed' });
        return;
    }

    var payloadList = [];
    $rows.each(function () {
        var $row = $(this);
        var payload = {
            roleId: roleId,
            entityNo: parseInt($row.data('entity-no'), 10) || 0,
            view: $row.find('.perm-view').is(':checked'),
            create: $row.find('.perm-create').is(':checked'),
            edit: $row.find('.perm-edit').is(':checked'),
            delete: $row.find('.perm-delete').is(':checked'),
            activeInActive: $row.find('.perm-activeinactive').is(':checked'),
            download: $row.find('.perm-download').is(':checked'),
            print: $row.find('.perm-print').is(':checked'),
            createdDate: null,
            createdBy: 1,
            updatedDate: null,
            updatedBy: 0,
            isActive: true,
            isDeleted: false
        };

        if (payload.entityNo > 0) {
            payloadList.push(payload);
        }
    });

    if (!payloadList.length) {
        setButtonBusy('#btnSaveRolePermission', false);
        showToast('No valid permission rows found to save.', 2500, { type: 'error', title: 'Save failed' });
        return;
    }

    $.ajax({
        url: '/Common/CreateRolePermission',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payloadList)
    })
        .done(function () {
            showToast('Role permissions saved successfully.', 2500, { type: 'success', title: 'Saved' });
            window.setTimeout(function () {
                window.location.href = '/Admin/Roles';
            }, 500);
        })
        .fail(function () {
            setButtonBusy('#btnSaveRolePermission', false);
            showToast('Unable to save role permissions.', 3000, { type: 'error', title: 'Save failed' });
        })
        .always(function () {
            if (!window.location.pathname.toLowerCase().includes('/admin/roles')) {
                setButtonBusy('#btnSaveRolePermission', false);
            }
        });
}
