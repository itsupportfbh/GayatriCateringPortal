// Utensils page script - render static data and wire actions
$(function () {
    var data = [
        { id: 'UT-001', name: 'Chafing Dish (Full)', rule: '1 per 50 pax', perPax: '0.02', minQty: 2, active: true },
        { id: 'UT-002', name: 'Chafing Dish (Half)', rule: '1 per 30 pax', perPax: '0.033', minQty: 1, active: true },
        { id: 'UT-003', name: 'Fork', rule: '1.2 per pax', perPax: '1.2', minQty: 20, active: true },
        { id: 'UT-004', name: 'Spoon', rule: '1.2 per pax', perPax: '1.2', minQty: 20, active: true },
        { id: 'UT-005', name: 'Plate', rule: '1.1 per pax', perPax: '1.1', minQty: 20, active: true },
        { id: 'UT-006', name: 'Serving Spoon', rule: '1 per dish', perPax: '—', minQty: 1, active: false }
    ];

    function render() {
        var $tbody = $('#utensilsTable tbody');
        $tbody.empty();
        data.forEach(function (u) {
            var toggleLabel = u.active ? 'Deactivate' : 'Activate';
            var toggleClass = u.active ? 'btn-success' : 'btn-light';
            var icon = u.name.indexOf('Chafing') >= 0 ? '🥘 ' : (u.name.indexOf('Fork') >= 0 ? '🍴 ' : (u.name.indexOf('Spoon') >= 0 ? '🥄 ' : '🍽️ '));
            var row = '<tr data-id="' + u.id + '">' +
                '<td>' + icon + u.name + '</td>' +
                '<td>' + u.rule + '</td>' +
                '<td>' + u.perPax + '</td>' +
                '<td>' + u.minQty + '</td>' +
                '<td>' + window.buildRowActions(u.id, { active: u.active }) + '</td></tr>';
            $tbody.append(row);
        });
    }

    function escapeHtml(text) {
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // update data when toggle clicked
    $(document).on('click', '.btn-toggle', function (e) {
        var id = $(this).data('id');
        var item = data.find(function (d) { return d.id === id; });
        if (!item) return;
        item.active = !item.active;
        render();
    });

    // when delete clicked, remove from data
    $(document).on('click', '.btn-delete', function (e) {
        var id = $(this).data('id');
        data = data.filter(function (d) { return d.id !== id; });
        render();
    });

    var editId = null;

    function openUtensilModal(id) {
        editId = id || null;
        if (id) {
            var item = data.find(function (d) { return d.id === id; });
            $('#utensilsModal .modal-title').text('Edit Utensil');
            $('#utNameField').val(item.name);
            $('#utRuleField').val(item.rule);
            $('#utPerPaxField').val(item.perPax);
            $('#utMinQtyField').val(item.minQty);
        } else {
            $('#utensilsModal .modal-title').text('Create Utensil');
            $('#utensilsModal').find('input, textarea').val('');
        }
        $('#utensilsModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-edit', function (e) {
        openUtensilModal($(this).data('id'));
    });

    // show static create modal
    $(document).on('click', '.btn-add, .page-header .btn.btn-orange', function (e) { openUtensilModal(); });
    $(document).on('click', '#utensilsModal .modal-close', function () { $('#utensilsModal').addClass('hidden'); });
    $(document).on('click', '#btnClearUtensil', function () { $('#utensilsModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSaveUtensil', function () {
        var payload = { name: $('#utNameField').val() || 'New Utensil', rule: $('#utRuleField').val() || '', perPax: $('#utPerPaxField').val() || '', minQty: parseInt($('#utMinQtyField').val() || 0, 10) || 0, active: true };
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) {
                item.name = payload.name;
                item.rule = payload.rule;
                item.perPax = payload.perPax;
                item.minQty = payload.minQty;
            }
        } else {
            payload.id = 'UT-' + String(Math.floor(Math.random() * 900) + 100);
            data.push(payload);
        }
        $('#utensilsModal').addClass('hidden');
        render();
    });

    // initial render
    render();
});