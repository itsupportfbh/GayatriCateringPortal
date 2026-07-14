$(document).ready(function () {
    editsetting();
});

function validateForm() {
    //clearsettingError('#Compname', '#CompnameError');
    //clearsettingError('#uen', '#uenError');
    //clearsettingError('#address', '#addressError');
    //clearsettingError('#email', '#emailError');
    //clearsettingError('#hotline', '#hotlineError');
    //clearsettingError('#whatsapp', '#whatsappError');
    //clearsettingError('#defaultdep', '#defaultdepError');
    //clearsettingError('#Quotaval', '#QuotavalError');
    //clearsettingError('#Minorder', '#MinorderError');
    //clearsettingError('#gstrate', '#gstrateError');
    //clearsettingError('#Servicechar', '#ServicecharError');

    var code = $('#Compname').val();
    if (code) {
        code = code.toString().trim();
    } else {
        code = '';
    }

    var name = $('#ItemName').val();
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
    //if (!validateForm()) {
    //    return;
    //}

    var setting = {
        Id: $('#settingId').val() || '',
        Name: $('#Compname').val() || '',
        UEN: $('#uen').val() || '',
        Address: $('#address').val() || '',
        Email: $('#email').val() || '',
        Hotline: $('#hotline').val() || '',
        Whatsapp: $('#whatsapp').val() || '',
        defautdep: $('#defaultdep').val() || '',
        Quotaval: $('#Quotaval').val() || '',
        Minorder: $('#Minorder').val() || '',
        gstrate: $('#gstrate').val() || '',
        servicechar: $('#Servicechar').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 1,
        CreatedDate: '',
        UpdatedBy: 1,
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
                clearUtensilForm();
                loadUtensils();
            } else {
                showToast('Unable to save settings.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editsetting() {
    $.ajax({
        url: '/Admin/settings/get',
        type: 'GET',
        success: function (setting) {
            if (!setting) {
                showToast('settings not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }
            $('#settingId').val(setting.Id || setting.id || '');
            $('#Compname').val(setting.Name || setting.name || '');
            $('#UEN').val(setting.UEN || setting.uen || '');
            $('#address').val(setting.Address || setting.address || '');
            $('#email').val(setting.Email || setting.email || '');
            $('#hotline').val(setting.Hotline || setting.hotline || '');
            $('#whatsapp').val(setting.Whatsapp || setting.whatsapp || '');
            $('#defaultdep').val(setting.DefaultDeposit || setting.defaultdeposit || '');
            $('#Quotaval').val(setting.QuotationValidity || setting.quotationValidity || '');
            $('#Minorder').val(setting.MinOrderPax || setting.minOrderPax || '');           
            $('#gstrate').val(setting.GSTRate || setting.gstate || '');
            $('#Servicechar').val(setting.Servicecharge || setting.servicecharge || '');
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