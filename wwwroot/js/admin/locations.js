// Locations page - client-side rendering and actions
$(function () {
    var data = [
        { id: 'LC-001', name: 'Celebrations Hall, SKA', address: '2 Tessensohn Road, S217664', capacity: 500, type: 'Function Hall', active: true },
        { id: 'LC-002', name: 'Customer Venue', address: 'As specified by customer', capacity: null, type: 'External', active: true }
    ];
    var editId = null;

    function render() {
        var html = '<table class="tbl"><thead><tr><th>Location</th><th>Address</th><th>Capacity</th><th>Type</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
        data.forEach(function (l) {
            html += '<tr data-id="' + l.id + '"><td><strong>' + l.name + '</strong></td><td>' + l.address + '</td><td>' + (l.capacity || '—') + '</td><td>' + l.type + '</td>' +
                '<td><span class="badge ' + (l.active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (l.active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td>' + window.buildRowActions(l.id, { active: l.active }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#locationsTable').html(html);
    }

    function openLocationModal(id) {
        editId = id || null;
        if (id) {
            var it = data.find(function (d) { return d.id === id; });
            $('#locationsModal .modal-title').text('Edit Location');
            $('#locNameField').val(it.name);
            $('#locAddressField').val(it.address);
            $('#locCapacityField').val(it.capacity);
            $('#locTypeField').val(it.type);
        } else {
            $('#locationsModal .modal-title').text('Create Location');
            $('#locationsModal').find('input, textarea').val('');
        }
        $('#locationsModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-delete', function () { var id = $(this).data('id'); data = data.filter(d => d.id !== id); render(); });
    $(document).on('click', '.btn-toggle', function () { var id = $(this).data('id'); var it = data.find(d => d.id === id); if (it) it.active = !it.active; render(); });
    $(document).on('click', '.btn-edit', function () { openLocationModal($(this).data('id')); });

    // show static create modal
    $(document).on('click', '#btnAddLocation, .btn-add', function () { openLocationModal(); });
    $(document).on('click', '#locationsModal .modal-close', function () { $('#locationsModal').addClass('hidden'); });
    $(document).on('click', '#btnClearLocation', function () { $('#locationsModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSaveLocation', function () {
        var payload = { name: $('#locNameField').val() || 'New Location', address: $('#locAddressField').val() || '', capacity: parseInt($('#locCapacityField').val()||0,10) || null, type: $('#locTypeField').val() || '', active: true };
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) {
                item.name = payload.name;
                item.address = payload.address;
                item.capacity = payload.capacity;
                item.type = payload.type;
            }
        } else {
            payload.id = 'LC-' + Math.floor(Math.random()*900+100);
            data.push(payload);
        }
        $('#locationsModal').addClass('hidden');
        render();
    });

    render();
});