$(document).ready(function () {
    loadMenus();
});

function closeMenuModal() {
    $('#MenuModal').addClass('hidden');
}

function openMenuModal() {
    clearMenuForm();
    $('#MenuModal').removeClass('hidden');
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
            var active = menu.isActive;

            var actions;
            if (active) {
                actions = `<button type="button" class="action-item btn-edit" data-id="${id}" onclick="editRole(this.dataset.id)"><span class="action-icon p-p-pencil"></span>Edit</button>
                           <button type="button" class="action-item btn-set-inactive" data-id="${id}" onclick="setRoleActive(this.dataset.id, false)"><span class="action-icon p-p-lock"></span>Inactive</button>`;
            } else {
                actions = `<button type="button" class="action-item btn-set-active" data-id="${id}" onclick="setRoleActive(this.dataset.id, true)"><span class="action-icon p-p-unlock"></span>Active</button>`;
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
                    <td>${CategoryId || ''}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="row-actions">
                            <button class="dots-btn" title="Actions">⋯</button>
                            <div class="actions-menu hidden">
                                ${actions}
                                <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deleteRole(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
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
    $('#ItemCode').val('');
    $('#ItemName').val('');
    $('#CategoryId').val('');
    $('#Price').val('');
    $('#PreparationTime').val('');
    $('#FoodType').val('1');
    $('#ServiceCharge').val('');
}

function saveMenu() {
    var menu = {
        Id: $('#menuId').val() || '',
        Code: $('#ItemCode').val() || '',
        Name: $('#ItemName').val() || '',
        CategoryId: $('#CategoryId').val() || '',
        Price: $('#Price').val() || '',
        PreparationTime: $('#PreparationTime').val() || '',
        FoodType: $('#FoodType').val() || '',
        Servicecharge: $('#ServiceCharge').val() || '',
        IsActive: true,
        IsDeleted: false,
        CreatedBy: 1,
        CreatedDate: '',
        UpdatedBy: 1,
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
                showToast('Unable to save Menus.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            showToast('Save failed.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function editRole(id) {
    $.ajax({
        url: '/Admin/FoodMenus/get/' + id,
        type: 'GET',
        success: function (role) {
            if (!role) {
                showToast('Menu not found.', 3000, { type: 'warning', title: 'Not found' });
                return;
            }
            $('#menuId').val(role.Id || role.id || '');
            $('#ItemCode').val(role.Code || role.code || '');
            $('#ItemName').val(role.Name || role.name || '');
            $('#CategoryId').val(role.categoryId || role.CategoryId || '');           
            $('#Price').val(role.price || role.Price || '');
            $('#PreparationTime').val(role.preparationTime || role.PreparationTime || '');
            $('#FoodType').val(role.foodType || role.FoodType || '');
            $('#ServiceCharge').val(role.servicecharge || role.Servicecharge || '');
            $('#MenuModal').removeClass('hidden');
        },
        error: function () { showToast('Unable to load Menu.', 3000, { type: 'error', title: 'Load failed' }); }
    });
}  

function deleteRole(id) {
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

function setRoleActive(id, isActive) {
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

