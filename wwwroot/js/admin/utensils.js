$(document).ready(function () {
    loadUtensils();
});

function closeMenuModal() {
    $('#utensilsModal').addClass('hidden');
}

function openMenuModal() {
    clearUtensilForm();
    $('#utensilsModal').removeClass('hidden');
}

function loadUtensils() {
    showutensilLoader(true);

    $.ajax({
        url: '/Admin/Utensils/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderUtensilList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderUtensilList([]);
            showToast('Unable to load Utensil.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showutensilLoader(false);
        }
    });
}

function showutensilLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#utensilListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderUtensilList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';
    if (rows.length) {
        html = rows.map(function (utensil) {
            var id = utensil.id || utensil.Id || '';
            var utensilName = utensil.utensilName || utensil.UtensilName || '';
            var unitType = utensil.unitType || utensil.UnitType || '';
            var price = utensil.price || utensil.Price || '';
            var depAmt = utensil.depositAmount || utensil.DepositAmount || '';
            var active = utensil.isActive;

            var actions;
            if (active) {
                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editUtensil(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setUtensilActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
            } else {
                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setUtensilActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
            }

            var statusBadge;
            if (active) {
                statusBadge = '<span class="badge-pill badge-pill--success">Active</span>';
            } else {
                statusBadge = '<span class="badge-pill badge-pill--warning">Inactive</span>';
            }

            return `
                <tr>
                    <td>${id}</td>
                    <td>${utensilName}</td>
                    <td>${unitType}</td>
                    <td>${price || ''}</td>
                    <td>${depAmt || ''}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteUtensil(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    $('#utensilList tbody').html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('utensilList');
    }
}

function clearUtensilForm() {
    $('#utName').val('');
    $('#utType').val('');
    $('#utPrice').val('');
    $('#utDepAmt').val('0.00');

    clearutensilError('#utName', '#utNameError');
    clearutensilError('#utType', '#utTypeError');
    clearutensilError('#utPrice', '#utPriceError');
    clearutensilError('#utDepAmt', '#utDepAmtError');
}

function setUtensilError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearutensilError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}

function initCategoryField(inputSelector, errorSelector) {
    clearCategoryError(inputSelector, errorSelector);
    var el = document.querySelector(inputSelector);
    if (el) {
        el.oninput = function () {
            clearCategoryError(inputSelector, errorSelector);
        };
    }
}

function validateForm() {
    clearutensilError('#utName', '#utNameError');
    clearutensilError('#utType', '#utTypeError');
    clearutensilError('#utPrice', '#utPriceError');
    clearutensilError('#utDepAmt', '#utDepAmtError'); 

    var code = $('#utName').val();
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
        setUtensilError('#utName', '#utNameError', 'Name is required');
        firstInvalid = '#utName';
    }

    if (!name) {
        setUtensilError('#utType', '#utTypeError', 'Type is required');
        if (!firstInvalid) {
            firstInvalid = '#utType';
        }
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}

function saveutensil() {
    if (!validateForm()) {
        return;
    }

    var menu = {
        Id: $('#utensilId').val() || '',
        UtensilName: $('#utName').val() || '',
        UnitType: $('#utType').val() || '',
        Price: $('#utPrice').val() || '',
        DepositAmount: $('#utDepAmt').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 1,
        CreatedDate: '',
        UpdatedBy: 1,
        UpdatedDate: ''
    };

    var endpoint = menu.Id ? '/Admin/Utensils/update' : '/Admin/Utensils/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(menu),
        success: function (res) {
            if (res && res.success) {
                showToast('Utensils saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearUtensilForm();
                $('#utensilsModal').addClass('hidden');
                loadUtensils();
            } else {
                showToast('Unable to save Utensils.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editUtensil(id) {
    $.ajax({
        url: '/Admin/Utensils/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) {
                showToast('Utensils not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }
            $('#utensilId').val(role.Id || role.id || '');
            $('#utName').val(role.UtensilName || role.utensilName || '');
            $('#utType').val(role.UnitType || role.unitType || '');
            $('#utPrice').val(role.Price || role.price || '');
            $('#utDepAmt').val(role.DepositAmount || role.depositAmount || '');
            $('#utensilsModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load Utensils.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}

function deleteUtensil(id) {
    if (!id) return;
    showToast('Delete this Utensil?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Utensils/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Utensils deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Utensils.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadUtensils, 300);
                },
                error: function () { showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' }); }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}

function setUtensilActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Utensils active?' : 'Mark this Utensils inactive?';
    var successMessage = isActive ? 'Utensils activated.' : 'Utensils marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Utensils/activeinactive/' + id + '?status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Utensils status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadUtensils, 350);
                },
                error: function () {
                    showToast('Request failed.', 3000, { type: 'error', title: 'Request failed' });
                }
            });
        },
        onNo: function () {
            showToast('Action cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
} 