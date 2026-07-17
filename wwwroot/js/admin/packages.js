$(document).ready(function () {
    initPackagePage();
});

var packagesData = [];
var categoryList = [];
var packageCategories = [];
var currentPackageId = 0;

function getQueryParam(param) {
    var params = new URLSearchParams(window.location.search);
    return params.get(param);
}

function initPackagePage() {
    if ($('#packagesTable').length) {
        loadPackages();
    }

    if ($('#packageName').length) {
        initPackageForm();
    }
}

function loadPackages() {
    showPackagesLoader(true);

    $.ajax({
        url: '/Admin/Packages/get',
        type: 'GET',
        dataType: 'json',
        success: function (items) {
            packagesData = Array.isArray(items) ? items : [];
            renderPackagesList(packagesData);
        },
        error: function () {
            packagesData = [];
            renderPackagesList(packagesData);
        },
        complete: function () {
            showPackagesLoader(false);
        }
    });
}

function renderPackagesList(rows) {
    rows = Array.isArray(rows) ? rows : [];
    var html = '';

    for (var i = 0; i < rows.length; i++) {
        var p = rows[i];
        var serial = i + 1;
        var packageName = p.name || '';
        var price = parseFloat(p.price) || 0;
        var active = p.isActive;
        var id = p.id || 0;

        var statusBadge = active
            ? '<span class="badge badge-confirmed">Active</span>'
            : '<span class="badge badge-cancelled">Inactive</span>';

        var actions = `
            <button type="button" class="action-item btn-edit" data-id="${id}" onclick="editPackage(${p.id})"><span class="action-icon p-p-pencil"></span>Edit</button>
            <button type="button" class="action-item btn-delete" data-id="${id}" onclick="deletePackage(this.dataset.id)"><span class="action-icon p-p-trash"></span>Delete</button>
            <button type="button" class="action-item btn-toggle" data-id="${id}" data-state="${active ? 'active' : 'inactive'}" onclick="togglePackageStatus(this.dataset.id, ${active ? 'false' : 'true'})"><span class="action-icon p-p-${active ? 'lock' : 'unlock'}"></span>${active ? 'Inactive' : 'Active'}</button>`;

        html += `
            <tr data-id="${id}">
                <td>${serial}</td>
                <td><strong>${packageName}</strong></td>
                <td class="num">S$ ${price.toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="row-actions">
                        <button type="button" class="dots-btn" title="Actions">⋯</button>
                        <div class="actions-menu hidden">
                            ${actions}
                        </div>
                    </div>
                </td>
            </tr>`;
    }

    $('#packagesTable tbody').html(html);

    if (typeof renderDataTable === 'function') {
        renderDataTable('packagesTable');
    }
}

function showPackagesLoader(show) {
    $('#packagesListPanel .table-wrap').toggleClass('hidden', show);
    $('.pageloaderpanel').toggleClass('hidden', !show);
}

function setFieldError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass('input-error');
    $(errorSelector).removeClass('hidden').text(message);
}

function clearFieldError(inputSelector, errorSelector) {
    $(inputSelector).removeClass('input-error');
    $(errorSelector).addClass('hidden').text('');
}

function initField(inputSelector, errorSelector) {
    clearFieldError(inputSelector, errorSelector);
    $(inputSelector).on('input', function () {
        clearFieldError(inputSelector, errorSelector);
    });
}

function createCategoryRow(item, takenIds) {
    takenIds = Array.isArray(takenIds) ? takenIds : [];

    var $row = $('<div class="category-row"></div>');
    $row.attr('data-id', item.id || '');

    var dropdownId = 'categoryDropdown_' + (item.id || Date.now());
    var $select = $('<select id="' + dropdownId + '" class="form-control category-select"></select>');
    $select.append('<option value="0">-- Select category --</option>');

    categoryList.forEach(function (c) {
        var cId = parseInt(c.Id, 10);
        if (takenIds.indexOf(cId) === -1) {
            var $option = $('<option></option>')
                .attr('value', cId)
                .text(c.Name);
            $select.append($option);
        }
    });

    $select.val(item.categoryId || '');
    $select.on('change', function () {
        item.categoryId = $(this).val();
        renderCategories();
    });

    var $quantity = $('<input type="number" class="form-control category-quantity" min="1" />');
    $quantity.val(item.quantity || 0);
    $quantity.on('input', function () {
        item.quantity = $(this).val();
    });

    var $remove = $('<button type="button" class="btn btn-light btn-sm btn-remove-category">Remove</button>');
    $remove.on('click', function () {
        var itemId = item.Id || 0;
        
        if (itemId && parseInt(itemId, 10) > 0) {
            $.ajax({
                url: '/Admin/PackageItems/delete/' + parseInt(itemId, 10),
                type: 'DELETE',
                dataType: 'json',
                success: function (result) {
                    if (result && result.success) {
                        packageCategories = packageCategories.filter(function (c) { return c !== item; });
                        renderCategories();
                        showToast('Category removed successfully.', 3000, { type: 'success', title: 'Removed' });
                    } else {
                        showToast('Unable to delete category.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                },
                error: function () {
                    showToast('Unable to delete category.', 3000, { type: 'error', title: 'Delete failed' });
                }
            });
        } else {
            packageCategories = packageCategories.filter(function (c) { return c !== item; });
            renderCategories();
            showToast('Category removed.', 3000, { type: 'success', title: 'Removed' });
        }
    });

    $row.append($select, $quantity, $remove);
    return $row;
}

function renderCategories() {
    var $container = $('#categoryRows');
    if (!$container.length) return;

    $container.empty();
    packageCategories.forEach(function (item) {
        var takenIds = packageCategories
            .filter(function (c) { return c !== item; })
            .map(function (c) { return parseInt(c.categoryId, 10); })
            .filter(function (id) { return id > 0; });
        $container.append(createCategoryRow(item, takenIds));
    });
}

function addCategoryRow() {
    var item = {
        id: '' + Date.now() + Math.random(),
        categoryId: '',
        quantity: 1
    };
    packageCategories.push(item);
    renderCategories();
}

function loadCategories(items) {
    var source = Array.isArray(items) ? items : [];
    categoryList = source.map(function (item) {
        return {
            Id:  item.id || 0,
            Name:  item.name || ''
        };
    });

    if (!packageCategories.length && categoryList.length) {
        addCategoryRow();
        return;
    }

    renderCategories();
}

function collectPayload() {
    return {
        Id: currentPackageId,
        Name: $('#packageName').val().toString().trim(),
        Description: $('#packageDescription').val().toString().trim(),
        Price: parseFloat($('#packagePrice').val()) || 0,
        IsActive: true,
        PackageItems: packageCategories
            .filter(function (c) { return c.categoryId; })
            .map(function (c) {
                return {
                    CategoryId: parseInt(c.categoryId, 10),
                    Quantity: parseInt(c.quantity, 10) || 1,
                    IsActive: true,
                    IsDeleted: false
                };
            })
    };
}

function validateForm() {
    debugger;
    clearFieldError('#packageName', '#packageNameError');
    clearFieldError('#packagePrice', '#packagePriceError');

    var firstInvalid = null;
    var name = $('#packageName').val().toString().trim();
    var price = $('#packagePrice').val();

    if (!name) {
        setFieldError('#packageName', '#packageNameError', 'Package name is required');
        firstInvalid = firstInvalid || '#packageName';
    }

    if (!price || parseFloat(price) <= 0) {
        setFieldError('#packagePrice', '#packagePriceError', 'Enter a valid price');
        firstInvalid = firstInvalid || '#packagePrice';
    }

    var hasCategorySelected = packageCategories.some(function (c) { return c.categoryId; });
    if (!hasCategorySelected) {
        showToast('Add at least one category', 3000, { type: 'error', title: 'Validation' });
        return false;
    }

    if (firstInvalid) {
        $(firstInvalid).focus();
        return false;
    }

    return true;
}


function loadPackageForEdit(id) {
    if (!id) return;

    $.ajax({
        url: '/Admin/Packages/get/' + id,
        type: 'GET',
        dataType: 'json',
        success: function (packageData) {
            $('#packageName').val(packageData.name || '');
            $('#packageDescription').val(packageData.description || '');
            $('#packagePrice').val(packageData.price || '');

            loadPackageItems(id);
        },
        error: function () {
            showToast('Unable to load package details.', 3000, { type: 'error', title: 'Load failed' });
        }
    });
}

function loadPackageItems(id) {
    if (!id) return;

    $.ajax({
        url: '/Admin/PackageItems/get?packageId=' + id,
        type: 'GET',
        dataType: 'json',
        success: function (items) {
            packageCategories = Array.isArray(items) ? items.map(function (item) {
                return {
                    Id: item.id || 0,
                    id: '' + Date.now() + Math.random(),
                    categoryId: parseInt(item.CategoryId || item.categoryId || 0, 10),
                    quantity: item.Quantity || item.quantity || 1
                };
            }) : [];

            loadFoodMenuCategories();
        },
        error: function () {
            loadFoodMenuCategories();
        }
    });
}

function loadFoodMenuCategories() {
    $.ajax({
        url: '/Admin/FoodMenuCategories/get',
        type: 'GET',
        dataType: 'json',
        success: function (items) {
            var source = Array.isArray(items) ? items : [];
            categoryList = source.map(function (item) {
                return {
                    Id:  item.id || 0,
                    Name:item.name || ''
                };
            });

            if (!packageCategories.length && categoryList.length) {
                addCategoryRow();
            } else {
                renderCategories();
            }
        },
        error: function () {
            categoryList = [];
            renderCategories();
        }
    });
}

function initPackageForm() {
    initField('#packageName', '#packageNameError');
    initField('#packagePrice', '#packagePriceError');

    $('#addCategoryRow').on('click', function (e) {
        e.preventDefault();
        var hasEmptyCategory = packageCategories.some(function (c) { return !c.categoryId; });
        if (hasEmptyCategory) {
            showToast('Please select a category for the current row', 3000, { type: 'error', title: 'Validation' });
            return;
        }
        addCategoryRow();
    });

    $('#clearPackage').on('click', function (e) {
        e.preventDefault();
        clearPackageForm();
    });

    $('#savePackage').on('click', function (e) {
        e.preventDefault();
        savePackage();
    });

    var packageId = parseInt(getQueryParam('packageId') || 0, 10);
    currentPackageId = packageId;

    if (packageId > 0) {
        setActionButtonLabel('#savePackage', 'Update');
        loadPackageForEdit(packageId);
        return;
    }

    loadFoodMenuCategories();
}

function savePackage() {
    if (!validateForm()) {
        return;
    }

    setButtonBusy('#savePackage', true, 'Saving...');

    var payload = collectPayload();
    var packagePayload = {
        Id: payload.Id,
        Name: payload.Name,
        Description: payload.Description,
        Price: payload.Price,
        IsActive: payload.IsActive,
        CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        CreatedDate: null,
        UpdatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
        UpdatedDate: null,
        IsDeleted: false
    };

    var isUpdate = packagePayload.Id && packagePayload.Id > 0;
    var endpoint = isUpdate ? '/Admin/Packages/update' : '/Admin/Packages/create';

    $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(packagePayload),
        success: function (result) {
            debugger;
            if (result && result.success) {
                var packageId = isUpdate ? packagePayload.Id : result.id;
                savePackageItems(packageId, payload.PackageItems, isUpdate);
            } else {
                setButtonBusy('#savePackage', false);
                var errorMsg = result && result.message ? result.message : 'Unable to save package.';
                showToast(errorMsg, 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#savePackage', false);
            showToast('Unable to save package.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function savePackageItems(packageId, items, isUpdate) {
    var preparedItems = Array.isArray(items) ? items : [];
    if (!preparedItems.length) {
        var successMsg = isUpdate ? 'Package updated successfully.' : 'Package created successfully.';
        showToast(successMsg, 500, { type: 'success', title: 'Success' });
        setButtonBusy('#savePackage', false);
        setTimeout(function () {
            window.location.href = '/Admin/Packages';
        }, 300);
        return;
    }

    var itemsPayload = preparedItems.map(function (item) {
        return {
            PackageId: packageId,
            CategoryId: parseInt(item.CategoryId || item.categoryId, 10),
            Quantity: parseInt(item.Quantity || item.quantity, 10) || 1,
            CreatedBy: window.getCurrentUserId ? window.getCurrentUserId() : 0,
            CreatedDate: new Date().toISOString(),
            IsActive: true,
            IsDeleted: false
        };
    });

    $.ajax({
        url: '/Admin/PackageItems/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(itemsPayload),
        success: function (result) {
            if (result && result.success) {
                var successMsg = isUpdate ? 'Package updated successfully.' : 'Package created successfully.';
                showToast(successMsg, 300, { type: 'success', title: 'Success' });
                setButtonBusy('#savePackage', false);
                setTimeout(function () {
                    window.location.href = '/Admin/Packages';
                }, 300);
            } else {
                setButtonBusy('#savePackage', false);
                showToast('Unable to save package items.', 3000, { type: 'error', title: 'Save failed' });
            }
        },
        error: function () {
            setButtonBusy('#savePackage', false);
            showToast('Unable to save package items.', 3000, { type: 'error', title: 'Save failed' });
        }
    });
}

function clearPackageForm() {
    $('#packageName').val('');
    $('#packageDescription').val('');
    $('#packagePrice').val('');
    packageCategories = [];
    renderCategories();
    clearFieldError('#packageName', '#packageNameError');
    clearFieldError('#packagePrice', '#packagePriceError');
}

function editPackage(id) {
    if (!id) return;
    window.location.href = '/Admin/Packages/edit?packageId=' + id;
}

function deletePackage(id) {
    if (!id) return;

    showToast('Delete this package?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Delete',
        noText: 'Cancel',
        onYes: function () {
            $.ajax({
                url: '/Admin/Packages/delete/' + id,
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (result && result.success) {
                        showToast('Package deleted successfully.', 3000, { type: 'success', title: 'Deleted' });
                    } else {
                        showToast('Unable to delete package.', 3000, { type: 'error', title: 'Delete failed' });
                    }
                    setTimeout(loadPackages, 300);
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

function togglePackageStatus(id, isActive) {
    if (!id) return;

    var confirmMessage = isActive ? 'Mark this package active?' : 'Mark this package inactive?';
    var successMessage = isActive ? 'Package activated.' : 'Package marked inactive.';

    showToast(confirmMessage, 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm',
        yesText: 'Yes',
        noText: 'No',
        onYes: function () {
            $.ajax({
                url: '/Admin/Packages/activeinactive?id=' + id + '&status=' + isActive,
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (result && result.success) {
                        showToast(successMessage, 3000, { type: 'success', title: 'Updated' });
                    } else {
                        showToast('Unable to update package status.', 3000, { type: 'error', title: 'Update failed' });
                    }
                    setTimeout(loadPackages, 300);
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

