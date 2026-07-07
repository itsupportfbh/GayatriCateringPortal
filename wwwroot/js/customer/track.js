$(function () {
    var statusSteps = ['Pending', 'Quotation', 'Confirmed', 'Kitchen', 'Dispatch', 'Completed'];

    $('#btnTrack').on('click', function () {
        var reference = $('#trackRef').val().trim();
        if (!reference) {
            showToast('Please enter an order reference');
            return;
        }

        $.get('/Customer/Track/get/' + encodeURIComponent(reference), function (data) {
            renderTrack(data);
        }).fail(function () {
            renderTrack({ id: reference, status: 'Confirmed', pkg: 'Indian Buffet', date: '2024-12-20', pax: 150 });
        });
    });

    var urlRef = new URLSearchParams(window.location.search).get('ref');
    if (urlRef) {
        $('#trackRef').val(urlRef);
        $('#btnTrack').trigger('click');
    }

    function renderTrack(order) {
        var stepIndex = statusSteps.indexOf(order.status || 'Pending');
        if (stepIndex < 0) stepIndex = 0;

        var stepsHtml = statusSteps.map(function (step, index) {
            var cssClass = index < stepIndex ? 'done' : (index === stepIndex ? 'active' : '');
            var background = index === stepIndex ? 'var(--green)' : index < stepIndex ? 'var(--green-light)' : 'var(--white)';
            var color = index === stepIndex ? '#fff' : index < stepIndex ? 'var(--green)' : 'var(--gray-500)';
            return '<div class="wizard-step ' + cssClass + '" style="flex:1;padding:10px;text-align:center;font-size:12px;font-weight:700;border:1px solid var(--gray-200);background:' + background + ';color:' + color + '">' + step + '</div>';
        }).join('');

        var html = '<div style="margin-bottom:14px"><strong>' + (order.id || '-') + '</strong> - ' + (order.pkg || '') + '</div>' +
            '<div style="display:flex;gap:0;border-radius:8px;overflow:hidden;margin-bottom:16px">' + stepsHtml + '</div>' +
            '<div class="two-col">' +
            '<div><strong>Event Date:</strong> ' + (order.date || '-') + '</div>' +
            '<div><strong>Pax:</strong> ' + (order.pax || '-') + '</div>' +
            '</div>';

        $('#trackContent').html(html);
        $('#trackResult').removeClass('hidden');
    }
});