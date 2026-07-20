$(document).ready(function () {
    loadMenus();
    loadCategories();
});

function closeMenuModal() {
    $('#MenuModal').addClass('hidden');
}

function openMenuModal() {
    clearMenuForm();
    $('#menu-title').text('Create Menu');
    setActionButtonLabel('#btnSaveMenu', 'Save');
    $('#MenuModal').removeClass('hidden');
     
    initCategoryField('#ItemCode', '#ItemCodeError');
    initCategoryField('#ItemName', '#ItemNameError');
    initCategoryField('#CategoryId', '#CategoryIdError');
    initCategoryField('#ItemPrice', '#PriceError');
    initCategoryField('#PreparationTime', '#PreparationTimeError');
    initCategoryField('#FoodType', '#FoodTypeError');
    initCategoryField('#ServiceCharge', '#ServiceChargeError');
}

function loadMenus() {
    showMenuLoader(true);

    $.ajax({
        url: '/Admin/FoodMenus/get',
        type: 'GET',
        dataType: 'json',
        success: function (rows) {
            renderMenuList(Array.isArray(rows) ? rows : []);
        },
        error: function () {
            renderMenuList([]);
            showToast('Unable to load Menus.', 3000, { type: 'error', title: 'Load failed' });
        },
        complete: function () {
            showMenuLoader(false);
        }
    });
}

function loadCategories(selectedId) {

    $.ajax({
        url: '/Admin/FoodMenuCategories/get',
        type: 'GET',
        dataType: 'json',
        success: function (categories) {

            var ddl = $('#CategoryId');
            ddl.empty();

            var ddlSearch = $('#catFilter');
            ddlSearch.empty();

            ddl.append('<option value="">Select Category</option>');
            ddlSearch.append('<option value="">Select Category</option>');

            $.each(categories, function (i, item) {

                var id = item.id || item.Id;
                var name = item.name || item.Name || item.categoryName || item.CategoryName;

                ddl.append(
                    $('<option>', {
                        value: id,
                        text: name
                    })
                );

                ddlSearch.append(
                    $('<option>', {
                        value: id,
                        text: name
                    })
                );
            });

            if (selectedId) {
                ddl.val(selectedId);
            }

            if (selectedId) {
                ddlSearch.val(selectedId);
            }
        },
        error: function () {
            showToast('Unable to load categories.', 3000, {
                type: 'error',
                title: 'Load Failed'
            });
        }
    });
}

function showMenuLoader(show) {
    var $panel = $('.pageloaderpanel');
    if ($panel.length) {
        $('#menusListPanel .table-wrap').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
        return;
    }
}

function renderMenuList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';
    if (rows.length) {
        html = rows.map(function (menu) {
            var id = menu.id || menu.Id || '';
            var code = menu.code || menu.Code || '';
            var name = menu.name || menu.Name || '';
            var CategoryId = menu.categoryId || menu.CategoryId || '';
            var Category = menu.category || menu.Category || '';
            var active = menu.isActive;

            var actions;
            if (active) {
                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editMenu(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setMenuActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
            } else {
                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setMenuActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
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
                    <td>${code}</td>
                    <td>${name}</td>
                    <td>${Category || ''}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteMenu(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
                            </div>
                        </div>
                    </td>
                </tr>`;
        }).join('');
    }

    $('#menusList tbody').html(html);
    if (typeof renderDataTable === 'function') {
        renderDataTable('menusList');
    }
}

function clearMenuForm() {
    $('#menuId').val('');
    $('#ItemCode').val('');
    $('#ItemName').val('');
    $('#CategoryId').val('');
    $('#ItemPrice').val('');
    $('#PreparationTime').val('');
    $('#FoodType').val('1');
    $('#ServiceCharge').val('');
    setActionButtonLabel('#btnSaveMenu', 'Save');

    clearMenuError('#ItemCode', '#ItemCodeError');
    clearMenuError('#ItemName', '#ItemNameError');
    clearMenuError('#CategoryId', '#CategoryIdError');
    clearMenuError('#Price', '#PriceError');
    clearMenuError('#PreparationTime', '#PreparationTimeError');
    clearMenuError('#FoodType', '#FoodTypeError');
    clearMenuError('#ServiceCharge', '#ServiceChargeError');
}

function setMenuError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearMenuError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}

function initCategoryField(inputSelector, errorSelector) {
    clearMenuError(inputSelector, errorSelector);
    var el = document.querySelector(inputSelector);
    if (el) {
        el.oninput = function () {
            clearMenuError(inputSelector, errorSelector);
        };
    }
}

function validateForm() {
    clearMenuError('#ItemCode', '#ItemCodeError');
    clearMenuError('#ItemName', '#ItemNameError');
    clearMenuError('#CategoryId', '#CategoryIdError');
    clearMenuError('#ItemPrice', '#PriceError');
    clearMenuError('#PreparationTime', '#PreparationTimeError');
    clearMenuError('#FoodType', '#FoodTypeError');
    clearMenuError('#ServiceCharge', '#ServiceChargeError');

    var code = $('#ItemCode').val();
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
        setMenuError('#ItemCode', '#ItemCodeError', 'Code is required');
        firstInvalid = '#ItemCode';
    }

    if (!name) {
        setMenuError('#ItemName', '#ItemNameError', 'Name is required');
        if (!firstInvalid) {
            firstInvalid = '#ItemName';
        }
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}

function saveMenu() {
    if (!validateForm()) {
        return;
    }

    setButtonBusy('#btnSaveMenu', true, 'Saving...');

    var menuId = $('#menuId').val();
    var menu = {
        Id: menuId ? parseInt(menuId) : 0,
        Code: $('#ItemCode').val() || '',
        Name: $('#ItemName').val() || '',
        CategoryId: $('#CategoryId').val() || '',
        Price: $('#ItemPrice').val() || '',
        PreparationTime: $('#PreparationTime').val() || '',
        FoodType: $('#FoodType').val() || '',
        Servicecharge: $('#ServiceCharge').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        CreatedDate: '',
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        UpdatedDate: ''
    };

    var endpoint = menu.Id ? '/Admin/FoodMenus/update' : '/Admin/FoodMenus/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(menu),
        success: function (res) {
            if (res && res.success) {
                showToast('FoodMenu saved successfully.', 3000, { type: 'success', title: 'Saved' });
                clearMenuForm();
                $('#MenuModal').addClass('hidden');
                loadMenus();
            } else {
                setButtonBusy('#btnSaveMenu', false);
                showToast('Unable to save Menus.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#btnSaveMenu', false);
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editMenu(id) {
    $('#menu-title').text('Edit Menu');
    $.ajax({
        url: '/Admin/FoodMenus/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) {
                showToast('Menu not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }

            /*loadCategories(data.categoryId);*/
            $('#menuId').val(role.Id || role.id || '');
            $('#ItemCode').val(role.Code || role.code || '');
            $('#ItemName').val(role.Name || role.name || '');
            loadCategories(role.categoryId || role.CategoryId || '');
            $('#CategoryId').val(role.categoryId || role.CategoryId || '');
            $('#ItemPrice').val(role.price || role.Price || '');
            $('#PreparationTime').val(role.preparationTime || role.PreparationTime || '');
            $('#FoodType').val(role.foodType || role.FoodType || '');
            $('#ServiceCharge').val(role.servicecharge || role.Servicecharge || '');
            setActionButtonLabel('#btnSaveMenu', 'Update');
            $('#MenuModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load Menu.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}

function deleteMenu(id) {
    if (!id) return;
    showToast('Delete this Menu?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/FoodMenus/delete/' + id,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast('Menu deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete Menu.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadMenus, 300);
                },
                error: function () { showToast('Delete failed.', 3000, { type: 'error', title: 'Delete failed' }); }
            });
        },
        onNo: function () {
            showToast('Delete cancelled.', 3000, { type: 'info', title: 'Cancelled' });
        }
    });
}

function setMenuActive(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this Menu active?' : 'Mark this Menu inactive?';
    var successMessage = isActive ? 'Menu activated.' : 'Menu marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/FoodMenus/activeinactive/' + id + '?status=' + isActive,
                type: 'POST',
                success: function (res) {
                    if (res && res.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update Menu status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadMenus, 350);
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

