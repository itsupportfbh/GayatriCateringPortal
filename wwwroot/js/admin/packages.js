// Packages page - client-side rendering and actions
$(function () {
    var data = [
        { id: 'PK-001', name: 'Indian Buffet', type: 'Buffet', price: 18.00, minPax: 50, slots: '2 Veg + 1 Non-Veg + 1 Dessert', active: true },
        { id: 'PK-002', name: 'Banana Leaf', type: 'Banana Leaf', price: 22.00, minPax: 30, slots: '4 Curries + Rice', active: true },
        { id: 'PK-003', name: 'Hi-Tea', type: 'Hi-Tea', price: 15.00, minPax: 30, slots: '4 Snacks + Drinks', active: true }
    ];

    function render() {
        var html = '<table class="tbl"><thead><tr><th>Package Name</th><th>Type</th><th class="num">Price/pax</th><th>Min Pax</th><th>Dish Slots</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
        data.forEach(function (p) {
            html += '<tr data-id="' + p.id + '"><td><strong>' + p.name + '</strong></td><td>' + p.type + '</td>' +
                '<td class="num">S$' + p.price.toFixed(2) + '</td><td>' + p.minPax + '</td><td>' + p.slots + '</td>' +
                '<td><span class="badge ' + (p.active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (p.active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td>' + window.buildRowActions(p.id, { active: p.active }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#packagesTable').html(html);
    }

    $(document).on('click', '.btn-delete', function () {
        var id = $(this).data('id');
        data = data.filter(function (d) { return d.id !== id; });
        render();
    });

    $(document).on('click', '.btn-toggle', function () {
        var id = $(this).data('id');
        var item = data.find(function (d) { return d.id === id; });
        if (!item) return;
        item.active = !item.active;
        render();
    });

    var editId = null;

    function openPackageModal(id) {
        editId = id || null;
        if (id) {
            var item = data.find(function (d) { return d.id === id; });
            $('#packagesModal .modal-title').text('Edit Package');
            $('#pkgNameField').val(item.name);
            $('#pkgPriceField').val(item.price);
        } else {
            $('#packagesModal .modal-title').text('Create Package');
            $('#packagesModal').find('input, textarea').val('');
        }
        $('#packagesModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-edit', function () {
        openPackageModal($(this).data('id'));
    });

    $(document).on('click', '.btn-add', function () {
        openPackageModal();
    });
    $(document).on('click', '#packagesModal .modal-close', function () { $('#packagesModal').addClass('hidden'); });
    $(document).on('click', '#btnClearPackage', function () { $('#packagesModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSavePackage', function () {
        var payload = { name: $('#pkgNameField').val() || 'New Package', price: parseFloat($('#pkgPriceField').val()||0) || 0, type: '', minPax: 0, slots: '', active: true };
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) {
                item.name = payload.name;
                item.price = payload.price;
            }
        } else {
            payload.id = 'PK-' + Math.floor(Math.random() * 900 + 100);
            data.push(payload);
        }
        $('#packagesModal').addClass('hidden');
        render();
    });

    render();
});