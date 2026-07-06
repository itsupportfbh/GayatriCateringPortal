// MealPeriods page - client-side rendering and actions
$(function () {
    var data = [
        { id: 'MP-001', name: 'Breakfast', start: '07:00', end: '10:00', active: true },
        { id: 'MP-002', name: 'Lunch', start: '11:00', end: '14:00', active: true },
        { id: 'MP-003', name: 'Hi-Tea', start: '15:00', end: '17:00', active: true }
    ];
    var editId = null;

    function render() {
        var html = '<table class="tbl"><thead><tr><th>Period</th><th>Start Time</th><th>End Time</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
        data.forEach(function (p) {
            html += '<tr data-id="' + p.id + '"><td>' + p.name + '</td><td>' + p.start + '</td><td>' + p.end + '</td>' +
                '<td><span class="badge ' + (p.active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (p.active ? 'Active' : 'Inactive') + '</span></td>' +
                '<td>' + window.buildRowActions(p.id, { active: p.active }) + '</td></tr>';
        });
        html += '</tbody></table>';
        $('#mealPeriodsTable').html(html);
    }

    function openMealPeriodModal(id) {
        editId = id || null;
        if (id) {
            var it = data.find(function (d) { return d.id === id; });
            $('#mealPeriodsModal .modal-title').text('Edit Period');
            $('#mpNameField').val(it.name);
            $('#mpStartField').val(it.start);
            $('#mpEndField').val(it.end);
        } else {
            $('#mealPeriodsModal .modal-title').text('Create Period');
            $('#mealPeriodsModal').find('input, textarea').val('');
        }
        $('#mealPeriodsModal').removeClass('hidden');
    }

    $(document).on('click', '.btn-delete', function () { var id = $(this).data('id'); data = data.filter(d => d.id !== id); render(); });
    $(document).on('click', '.btn-toggle', function () { var id = $(this).data('id'); var it = data.find(d => d.id === id); if (it) it.active = !it.active; render(); });
    $(document).on('click', '.btn-edit', function () { openMealPeriodModal($(this).data('id')); });

    // static create modal
    $(document).on('click', '#btnAddPeriod, .btn-add', function () { openMealPeriodModal(); });
    $(document).on('click', '#mealPeriodsModal .modal-close', function () { $('#mealPeriodsModal').addClass('hidden'); });
    $(document).on('click', '#btnClearPeriod', function () { $('#mealPeriodsModal').find('input, textarea').val(''); });
    $(document).on('click', '#btnSavePeriod', function () {
        var payload = { name: $('#mpNameField').val() || 'New Period', start: $('#mpStartField').val() || '00:00', end: $('#mpEndField').val() || '00:00', active: true };
        if (editId) {
            var item = data.find(function (d) { return d.id === editId; });
            if (item) {
                item.name = payload.name;
                item.start = payload.start;
                item.end = payload.end;
            }
        } else {
            payload.id = 'MP-' + Math.floor(Math.random()*900+100);
            data.push(payload);
        }
        $('#mealPeriodsModal').addClass('hidden');
        render();
    });

    render();
});