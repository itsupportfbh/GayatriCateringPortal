// Communications page - render logs and actions
$(function () {
    var data = [
        { id: 'CM-001', dt: '2024-12-15 10:30', order: 'GC-2024-024', customer: 'Raj Kumar', channel: 'WhatsApp', msg: 'Quotation QT-2024-024 sent', by: 'Admin' },
        { id: 'CM-002', dt: '2024-12-14 14:15', order: 'GC-2024-023', customer: 'Priya Nair', channel: 'Email', msg: 'Order confirmation sent', by: 'Admin' }
    ];

    function render() {
        var html = '<table class="tbl"><thead><tr><th>Date/Time</th><th>Order</th><th>Customer</th><th>Channel</th><th>Message</th><th>Sent By</th><th>Actions</th></tr></thead><tbody>';
        data.forEach(function (r) {
            html += '<tr data-id="' + r.id + '"><td>' + r.dt + '</td><td>' + r.order + '</td><td>' + r.customer + '</td><td><span class="badge badge-confirmed">' + r.channel + '</span></td><td>' + r.msg + '</td><td>' + r.by + '</td>' +
                '<td>' + window.buildRowActions(r.id, { active: true }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#commsTable').html(html);
    }

    var editId = null;

    function openCommsModal(id) {
        editId = id || null;
        if (id) {
            var it = data.find(function (d) { return d.id === id; });
            $('#commsModal .modal-title').text('Edit Communication');
            $('#cmChannel').val(it.channel);
            $('#cmMsgField').val(it.msg);
        } else {
            $('#commsModal .modal-title').text('Log Communication');
            $('#commsModal').find('input, textarea').val('');
            $('#cmChannel').val('WhatsApp');
        }
        $('#commsModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-delete', function () { var id = $(this).data('id'); data = data.filter(d => d.id !== id); render(); });
    $(document).on('click', '.btn-edit', function () { openCommsModal($(this).data('id')); });

    // static create modal handlers
    $(document).on('click', '#btnAddComms, .btn-add', function () { openCommsModal(); });
    $(document).on('click', '#commsModal .modal-close', function () { $('#commsModal').addClass('hidden'); });
    $(document).on('click', '#btnClearComms', function () { $('#commsModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSaveComms', function () {
        setButtonBusy('#btnSaveComms', true, 'Saving...');
        var payload = { channel: $('#cmChannel').val() || 'WhatsApp', msg: $('#cmMsgField').val() || '' };
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) {
                item.channel = payload.channel;
                item.msg = payload.msg;
            }
        } else {
            data.push({ id: 'CM-' + Math.floor(Math.random()*900+100), dt: new Date().toISOString().slice(0,16).replace('T',' '), order: '', customer: '', channel: payload.channel, msg: payload.msg, by: 'Admin' });
        }
        $('#commsModal').addClass('hidden');
        render();
        setButtonBusy('#btnSaveComms', false);
    });
    render();
});