// MealPeriods page - client-side rendering and actions



$(document).ready(function () {
    loadMealPeriod();
});


function loadMealPeriod() {
    $.ajax({
        url: '/Admin/MealPeriods/getAll',
        type: 'GET',
        success: function (rows) {
            renderMealPeriodList(rows || []);
        },
        error: function () {
            renderMealPeriodList([]);
        }
    });
}


function renderMealPeriodList(rows) {
    rows = Array.isArray(rows) ? rows : [];

    var html = rows.map(function (meal, index) {

        var serial = index + 1;

        var id = meal.id ?? meal.Id ?? '';
        var code = meal.code ?? meal.Code ?? '';
        var mealPeriodName = meal.mealPeriodName ?? meal.MealPeriodName ?? '';
        var startTime = meal.startTime ?? meal.StartTime ?? '';
        var endTime = meal.endTime ?? meal.EndTime ?? '';
        var displayOrder = meal.displayOrder ?? meal.DisplayOrder ?? '';
        var activeValue = meal.isActive ?? meal.IsActive ?? false;

        var active = activeValue === true ||
            activeValue === 'true' ||
            activeValue === 'True' ||
            activeValue === '1' ||
            activeValue === 1;

        var actions;

        if (active) {
            actions = `
                <button type="button" class="action-item btn-edit" data-id="${id}" onclick="editMealPeriod(this.dataset.id)">
                    <span class="action-icon p-p-pencil"></span>Edit
                </button>
                <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setMealPeriodActive(this.dataset.id, false)">
                    <span class="action-icon p-p-lock"></span>Inactive
                </button>`;
        } else {
            actions = `
                <button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setMealPeriodActive(this.dataset.id, true)">
                    <span class="action-icon p-p-unlock"></span>Active
                </button>`;
        }

        var statusBadge = active
            ? '<span class="badge-pill badge-pill--success">Active</span>'
            : '<span class="badge-pill badge-pill--warning">Inactive</span>';

        return `
            <tr>
                <td>${serial}</td>
                <td>${code}</td>
                <td>${mealPeriodName}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td>${displayOrder}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="row-actions">
                        <button class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">
                            ${actions}
                            <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteMealPeriod(this.dataset.id)">
                                <span class="action-icon p-p-trash"></span>Delete
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`;
    }).join('');

    $('#mealPeriodList tbody').html(html);

    if (typeof renderDataTable === 'function') {
        renderDataTable('mealPeriodList');
    }
}


function clearMealPeriodForm() {
    $('#mealPeriodId').val('');
    $('#mealPeriodCode').val('');
    $('#mealPeriodName').val('');
    $('#mealPeriodStartTime').val('');
    $('#mealPeriodEndTime').val('');
    $('#mealPeriodDisplayOrder').val('');
    $('#mealPeriodIsActive').prop('checked', true);
}


function closeMealPeriodModal() {
    $('#mealPeriodsModal').addClass('hidden');
}


function openMealPeriodModal() {
    clearMealPeriodForm();
    $('#mealPeriodsModal').removeClass('hidden');
}


function saveMealPeriod() {

    var id = $('#mealPeriodId').val() || '0';

    var mealPeriod = {
        Id: id,
        Code: ($('#mealPeriodCode').val() || '').trim(),
        MealPeriodName: ($('#mealPeriodName').val() || '').trim(),
        StartTime: $('#mealPeriodStartTime').val() || null,
        EndTime: $('#mealPeriodEndTime').val() || null,
        DisplayOrder: $('#mealPeriodDisplayOrder').val() || '0',
        IsActive: 'true',
        IsDeleted: 'false',

        CreatedBy: id === '0' ? '1' : null,
        CreatedDate: id === '0'
            ? new Date().toISOString()
            : '',

        UpdatedBy: id !== '0' ? '1' : null,
        UpdatedDate: id !== '0'
            ? new Date().toISOString()
            : null
    };


    // VALIDATION

  


    if (!mealPeriod.MealPeriodName) {
        showToast(
            'Meal Period Name is required.',
            3000,
            {
                type: 'warning',
                title: 'Validation'
            });

        $('#mealPeriodName').focus();
        return;
    }


    if (!mealPeriod.StartTime) {
        showToast(
            'Start Time is required.',
            3000,
            {
                type: 'warning',
                title: 'Validation'
            });

        $('#mealPeriodStartTime').focus();
        return;
    }


    if (!mealPeriod.EndTime) {
        showToast(
            'End Time is required.',
            3000,
            {
                type: 'warning',
                title: 'Validation'
            });

        $('#mealPeriodEndTime').focus();
        return;
    }


    if (parseInt(mealPeriod.DisplayOrder) <= 0) {
        showToast(
            'Display Order must be greater than zero.',
            3000,
            {
                type: 'warning',
                title: 'Validation'
            });

        $('#mealPeriodDisplayOrder').focus();
        return;
    }


    if (mealPeriod.StartTime >= mealPeriod.EndTime) {
        showToast(
            'End Time must be greater than Start Time.',
            3000,
            {
                type: 'warning',
                title: 'Validation'
            });

        $('#mealPeriodEndTime').focus();
        return;
    }


    var endpoint = id !== '0'
        ? '/Admin/MealPeriods/update'
        : '/Admin/MealPeriods/create';


    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(mealPeriod),

        success: function (res) {

            if (res && res.success) {

                var message = id !== '0'
                    ? 'Meal Period updated successfully.'
                    : 'Meal Period created successfully.';

                showToast(
                    message,
                    3000,
                    {
                        type: 'success',
                        title: 'Saved'
                    });

                clearMealPeriodForm();

                $('#mealPeriodsModal')
                    .addClass('hidden');

                loadMealPeriod();

            } else {

                var message =
                    res && res.message
                        ? res.message
                        : 'Unable to save Meal Period.';

                showToast(
                    message,
                    3000,
                    {
                        type: 'error',
                        title: 'Save failed'
                    });
            }
        },


        error: function (xhr) {

            var message = 'Save failed.';

            if (xhr.responseJSON) {

                if (xhr.responseJSON.message) {
                    message =
                        xhr.responseJSON.message;
                }
                else if (xhr.responseJSON.title) {
                    message =
                        xhr.responseJSON.title;
                }
            }

            showToast(
                message,
                3000,
                {
                    type: 'error',
                    title: 'Save failed'
                });
        }
    });
}

function editMealPeriod(id) {
    $.ajax({
        url: '/Admin/MealPeriods/get/' + id,
        type: 'GET',
        success: function (meal) {
            if (!meal) {
                showToast('Meal Period not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }

            $('#mealPeriodId').val(meal.Id || meal.id || '');
            $('#mealPeriodCode').val(meal.Code || meal.code || '');
            $('#mealPeriodName').val(meal.MealPeriodName || meal.mealPeriodName || '');
            $('#mealPeriodStartTime').val(meal.StartTime || meal.startTime || '');
            $('#mealPeriodEndTime').val(meal.EndTime || meal.endTime || '');
            $('#mealPeriodDisplayOrder').val(meal.DisplayOrder || meal.displayOrder || '');

            $('#mealPeriodsModal').removeClass('hidden');
        },
        error: function () {
            showToast('Unable to load Meal Period.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}


function setMealPeriodActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Meal Period active?' : 'Mark this Meal Period inactive?';
    var successMessage = isActive ? 'Meal Period activated.' : 'Meal Period marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/MealPeriods/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Meal Period status.', 3000, { type: 'error', title: 'Update failed' });
                    }

                    setTimeout(loadMealPeriod, 350);
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


function deleteMealPeriod(id) {
    if (!id) return;

    showToast('Delete this Meal Period?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/MealPeriods/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Meal Period deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Meal Period.', 3000, { type: 'error', title: 'Delete failed' });
                    }

                    setTimeout(loadMealPeriod, 300);
                },
                error: function () {
                    showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' });
                }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}













































   