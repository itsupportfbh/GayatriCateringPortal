$(function () {
    $('#btnSaveSettings').on('click', function () {
        setButtonBusy('#btnSaveSettings', true, 'Saving...');
        showToast('Settings saved successfully');
        setTimeout(function () { setButtonBusy('#btnSaveSettings', false); }, 300);
    });
});