$(document).ready(function () {
    editsetting();
});

function validateForm() {
    clearsettingError('#Compname', '#CompnameError');
    clearsettingError('#uen', '#uenError');
    clearsettingError('#address', '#addressError');
    clearsettingError('#email', '#emailError');
    clearsettingError('#hotline', '#hotlineError');
    clearsettingError('#whatsapp', '#whatsappError');
    clearsettingError('#defaultdep', '#defaultdepError');
    clearsettingError('#Quotaval', '#QuotavalError');
    clearsettingError('#Minorder', '#MinorderError');
    clearsettingError('#gstrate', '#gstrateError');
    clearsettingError('#Servicechar', '#ServicecharError');

    var code = $('#Compname').val();
    if (code) {
        code = code.toString().trim();
    } else {
        code = '';
    }

    var name = $('#uen').val();
    if (name) {
        name = name.toString().trim();
    } else {
        name = '';
    }

    var firstInvalid = null;

    if (!code) {
        setsettingError('#Compname', '#CompnameError', 'Name is required');
        firstInvalid = '#Compname';
    }

    if (!name) {
        setsettingError('#uen', '#uenError', 'UEN is required');
        if (!firstInvalid) {
            firstInvalid = '#uen';
        }
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}

function savesettings() {
    if (!validateForm()) {
        return;
    }

    setButtonBusy('#btnSaveSettings', true, 'Saving...');

    var settingId = $('#settingId').val();
    var setting = {
        Id: settingId ? parseInt(settingId) : 0,
        Name: $('#Compname').val() || '',
        UEN: $('#uen').val() || '',
        Address: $('#address').val() || '',
        Email: $('#email').val() || '',
        Hotline: $('#hotline').val() || '',
        Whatsapp: $('#whatsapp').val() || '',
        DefaultDeposit: $('#defaultdep').val() || '',
        QuotationValidity: $('#Quotaval').val() || '',
        MinOrderPax: $('#Minorder').val() || '',
        GSTRate: $('#gstrate').val() || '',
        Servicecharge: $('#Servicechar').val() || '',
        PortalMode: $('#portalmode').val() || '',
        GSTNO : 'GUH84945',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        CreatedDate: '',
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        UpdatedDate: ''
    };

    var endpoint = setting.Id ? '/Admin/settings/update' : '/Admin/settings/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(setting),
        success: function (res) {
            if (res && res.success) {
                showToast('settings saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearsettingForm();
            } else {
                setButtonBusy('#saveCategoryBtn', false);
                showToast('Unable to save settings.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#saveCategoryBtn', false);
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
//$(function () {
//    $('#btnSaveSettings').on('click', function () {
//        setButtonBusy('#btnSaveSettings', true, 'Saving...');
//        showToast('Settings saved successfully');
//        setTimeout(function () { setButtonBusy('#btnSaveSettings', false); }, 300);
    });
}

function editsetting() {
    $.ajax({
        url: '/Admin/settings/get',
        type: 'GET',
        success: function (setting) {          

            if (!setting || setting.length === 0) {
                showToast('Settings not found.');
                return;
            }

            var data = setting[0]; 
           
            $('#settingId').val(data.id);
            $('#Compname').val(data.name);
            $('#uen').val(data.uen);
            $('#address').val(data.address);
            $('#email').val(data.email);
            $('#hotline').val(data.hotline);
            $('#whatsapp').val(data.whatsapp);
            $('#defaultdep').val(data.defaultDeposit);
            $('#Quotaval').val(data.quotationValidity);
            $('#Minorder').val(data.minOrderPax);
            $('#gstrate').val(data.gstRate);
            $('#Servicechar').val(data.servicecharge);
            $('#portalmode').val(data.portalMode);
        },
        error: function () { showToast('Unable to load settings.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}

function clearsettingForm() {
    $('#settingId').val('');
    $('#Compname').val('');
    $('#uen').val('');
    $('#address').val('');
    $('#email').val('');
    $('#hotline').val('');
    $('#whatsapp').val('');
    $('#defaultdep').val('');
    $('#Quotaval').val('');
    $('#Minorder').val('');
    $('#gstrate').val('');
    $('#Servicechar').val('');

    clearsettingError('#Compname', '#CompnameError');
    clearsettingError('#uen', '#uenError');
    clearsettingError('#address', '#addressError');
    clearsettingError('#email', '#emailError');
    clearsettingError('#hotline', '#hotlineError');
    clearsettingError('#whatsapp', '#whatsappError');
    clearsettingError('#defaultdep', '#defaultdepError');
    clearsettingError('#Quotaval', '#QuotavalError');
    clearsettingError('#Minorder', '#MinorderError');
    clearsettingError('#gstrate', '#gstrateError');
    clearsettingError('#Servicechar', '#ServicecharError');
}

function setsettingError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearsettingError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}