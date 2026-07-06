$(function () {
    var demoData = [
        { name: 'Raj Kumar', phone: '+65 9111 2222', email: 'raj@email.com', orders: 3, totalSpend: 15000 },
        { name: 'Priya Nair', phone: '+65 9333 4444', email: 'priya@email.com', orders: 2, totalSpend: 4200 },
        { name: 'Anand Corp', phone: '+65 9555 6666', email: 'anand@corp.com', orders: 5, totalSpend: 18000 }
    ];

    $.get('/Admin/Customers/GetCustomers').done(function (rows) {
        render(rows);
    }).fail(function () {
        render(demoData);
    });

    function render(rows) {
        var html = '<table class="tbl" id="custTbl"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Orders</th><th class="num">Total Spend</th><th>Actions</th></tr></thead><tbody>';
        rows.forEach(function (row) {
            html += '<tr><td><strong>' + (row.name || '') + '</strong></td><td>' + (row.phone || '') + '</td><td>' + (row.email || '') + '</td>' +
                '<td>' + (row.orders || 0) + '</td><td class="num">S$' + ((row.totalSpend || 0).toLocaleString()) + '</td>' +
                '<td>' + window.buildRowActions((row.phone||row.email||row.name), { showEdit:false, showDelete:false, showToggle:false, showWA:true, active:false }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#customersTable').html(html);
    }

    // Show static Create Customer modal
    $(document).on('click', '#btnAddCustomer, .btn-add', function () {
        $('#customersModal').removeClass('hidden');
    });

    // modal close
    $(document).on('click', '#customersModal .modal-close', function () { $('#customersModal').addClass('hidden'); });

    // clear fields
    $(document).on('click', '#btnClearCustomer', function () {
        $('#customersModal').find('input').val('');
    });

    // save new customer
    $(document).on('click', '#btnSaveCustomer', function () {
        var newCust = {
            name: $('#newCustName').val() || 'New Customer',
            phone: $('#newCustPhone').val() || '',
            email: $('#newCustEmail').val() || '',
            orders: 0,
            totalSpend: 0
        };
        demoData.push(newCust);
        $('#customersModal').addClass('hidden');
        render(demoData);
    });

    $('#custSearch').on('keyup', function () {
        var value = $(this).val().toLowerCase();
        $('#custTbl tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});