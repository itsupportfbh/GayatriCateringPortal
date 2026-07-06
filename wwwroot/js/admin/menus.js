$(function () {
    var items = [
        { id: 1, name: 'Basmati Rice', cat: 'Rice & Breads', price: 2.50, type: 'Veg', active: true },
        { id: 2, name: 'Paneer Butter Masala', cat: 'Vegetarian', price: 5.00, type: 'Veg', active: true },
        { id: 3, name: 'Chicken Masala', cat: 'Non-Vegetarian', price: 6.00, type: 'Non-Veg', active: true },
        { id: 4, name: 'Gulab Jamun', cat: 'Desserts', price: 2.50, type: 'Veg', active: true },
        { id: 5, name: 'Masala Chai', cat: 'Drinks', price: 1.50, type: 'Veg', active: true }
    ];

    $.get('/Admin/GetMenuItems', function (rows) {
        render(rows);
    }).fail(function () {
        render(items);
    });

    function render(rows) {
        var html = '<table class="tbl" id="menuTbl"><thead><tr><th>Name</th><th>Category</th><th>Type</th><th class="num">Price/pax</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
        rows.forEach(function (row) {
            html += '<tr><td><strong>' + row.name + '</strong></td><td>' + row.cat + '</td>' +
                '<td><span class="badge ' + (row.type === 'Veg' ? 'badge-confirmed' : 'badge-cancelled') + '">' + row.type + '</span></td>' +
                '<td class="num">S$' + parseFloat(row.price || 0).toFixed(2) + '</td>' +
                '<td><span class="badge ' + (row.active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (row.active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td>' + window.buildRowActions(row.id, { active: row.active }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#menuTable').html(html);
    }

    $('#btnAddMenu').on('click', function () {
        $('#addMenuModal').removeClass('hidden');
    });

    $('.modal-close').on('click', function () {
        $('#addMenuModal').addClass('hidden');
    });

    $('#btnSaveMenu').on('click', function () {
        var name = $('#newItemName').val().trim();
        if (!name) {
            showToast('Item name required');
            return;
        }

        $.post('/Admin/AddMenuItem', {
            name: name,
            cat: $('#newItemCat').val(),
            price: $('#newItemPrice').val(),
            type: $('#newItemType').val(),
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        }, function () {
            showToast('Item added');
            $('#addMenuModal').addClass('hidden');
            location.reload();
        }).fail(function () {
            showToast('Item added (demo)');
            $('#addMenuModal').addClass('hidden');
        });
    });

    $('#menuSearch').on('keyup', function () {
        var value = $(this).val().toLowerCase();
        $('#menuTbl tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $('#catFilter').on('change', function () {
        var value = $(this).val().toLowerCase();
        $('#menuTbl tbody tr').each(function () {
            $(this).toggle(!value || $(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});