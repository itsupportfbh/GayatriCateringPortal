$(function () {
    loadRoles();

    $('#rolesSearch').on('keyup', function () {
        var value = $(this).val().toLowerCase();
        $('#rolesMatrix tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

function loadRoles() {
    var fallbackRoles = [
        { id: 'RL-001', code: 'SUPER', name: 'Super Admin', remarks: 'Full access to everything', isActive: '1' },
        { id: 'RL-002', code: 'ADMIN', name: 'Admin', remarks: 'Manage orders, customers, packages', isActive: '1' },
        { id: 'RL-003', code: 'SALES', name: 'Sales', remarks: 'Quotation and customer interaction', isActive: '1' }
    ];

    $.get('/Admin/Roles/get').done(function (rows) {
        renderRoles(rows);
    }).fail(function () {
        renderRoles(fallbackRoles);
    });
}

function renderRoles(rows) {
    rows = rows || [];
    var html = rows.map(function (role) {
        var active = role.isActive === '1' || role.isActive === 'true' || role.IsActive === '1' || role.IsActive === 'true';
        return '<tr>' +
            '<td>' + (role.id || role.Id || '') + '</td>' +
            '<td>' + (role.code || role.Code || '') + '</td>' +
            '<td>' + (role.name || role.Name || '') + '</td>' +
            '<td>' + (role.remarks || role.Remarks || '') + '</td>' +
            '<td><span class="badge ' + (active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (active ? 'Active' : 'Inactive') + '</span></td>' +
            '<td>' + window.buildRowActions(role.id || role.Id || '', { active: active }) + '</td>' +
            '</tr>';
    }).join('');
    $('#rolesMatrix tbody').html(html);
}