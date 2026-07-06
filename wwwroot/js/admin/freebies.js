// Freebies page - render static freebies and actions
$(function () {
    var data = [
        { id: 'FB-001', name: 'Papad', trigger: 'All packages', condition: 'Always included', active: true },
        { id: 'FB-002', name: 'Pickle', trigger: 'All packages', condition: 'Always included', active: true },
        { id: 'FB-003', name: 'Raita', trigger: 'Biryani orders', condition: 'When Biryani selected', active: true }
    ];
    var editId = null;

    function render() {
        var html = '<table class="tbl"><thead><tr><th>Item</th><th>Trigger</th><th>Condition</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
        data.forEach(function (f) {
            html += '<tr data-id="' + f.id + '"><td>🎁 ' + f.name + '</td><td>' + f.trigger + '</td><td>' + f.condition + '</td>' +
                '<td><span class="badge ' + (f.active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (f.active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td>' + window.buildRowActions(f.id, { active: f.active }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#freebiesTable').html(html);
    }

    function openFreebieModal(id) {
        editId = id || null;
        if (id) {
            var it = data.find(function (d) { return d.id === id; });
            $('#freebiesModal .modal-title').text('Edit Freebie');
            $('#fbNameField').val(it ? it.name : '');
        } else {
            $('#freebiesModal .modal-title').text('Create Freebie');
            $('#freebiesModal').find('input, textarea').val('');
        }
        $('#freebiesModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-delete', function () {
        var id = $(this).data('id'); data = data.filter(function (d) { return d.id !== id; }); render();
    });
    $(document).on('click', '.btn-toggle', function () { var id = $(this).data('id'); var it = data.find(d => d.id === id); if (it) it.active = !it.active; render(); });
    $(document).on('click', '.btn-edit', function () { openFreebieModal($(this).data('id')); });

    // show static create modal
    $(document).on('click', '#btnAddFreebie, .btn-add', function () { openFreebieModal(); });
    $(document).on('click', '#freebiesModal .modal-close', function () { $('#freebiesModal').addClass('hidden'); });
    $(document).on('click', '#btnClearFreebie', function () { $('#freebiesModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSaveFreebie', function () {
        var name = $('#fbNameField').val() || 'New Freebie';
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) item.name = name;
        } else {
            data.push({ id: 'FB-' + Math.floor(Math.random()*900+100), name: name, trigger: '', condition: '', active: true });
        }
        $('#freebiesModal').addClass('hidden');
        render();
    });

    render();
});