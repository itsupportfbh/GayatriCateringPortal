$(document).ready(function () {
    ensurePackageDetailModal();
    loadPackages();

    $(document).on('click', '.package-detail-close', closePackageDetails);
    $(document).on('click', '#packageDetailModal', function (event) {
        if (event.target === this) closePackageDetails();
    });
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape') closePackageDetails();
    });
});

function ensurePackageDetailModal() {
    if ($('#packageDetailModal').length) return;

    $('body').append(
        '<div class="package-detail-overlay" id="packageDetailModal" aria-hidden="true">' +
            '<div class="package-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="packageDetailTitle">' +
                '<button type="button" class="package-detail-close" aria-label="Close package details">&times;</button>' +
                '<div class="package-detail-heading">' +
                    '<div class="package-detail-kicker">Package menu</div>' +
                    '<h2 id="packageDetailTitle">Package Details</h2>' +
                '</div>' +
                '<div class="package-detail-content" id="packageDetailContent"></div>' +
            '</div>' +
        '</div>'
    );
}

function loadPackages() {
    $.ajax({
        url: '/Customer/Packages/get',
        type: 'GET',
        success: function (data) { renderPackages(data); },
        error: function () { renderPackages([]); }
    });
}

function renderPackages(packages) {
    var html = '';
    if (!Array.isArray(packages) || packages.length === 0) {
        html = '<div class="card"><p class="muted">No packages available right now. Please check back later.</p></div>';
    } else {
        html = packages.map(function (item) {
            var price = parseFloat(item.price || item.Price || 0) || 0;
            var description = item.description || item.Description || 'A catering package with event setup options.';
            var packageName = item.name || item.Name || 'Package';
            var packageId = parseInt(item.id || item.Id, 10) || 0;
            var isActive = item.isActive === '1' || item.isActive === 'true' || item.isActive === true || item.IsActive === '1' || item.IsActive === 'true' || item.IsActive === true;
            var buttonClass = isActive ? 'btn-primary' : 'btn-light disabled';
            var buttonText = isActive ? 'View' : 'Unavailable';

            return '<article class="preset-card' + (isActive ? '' : ' muted') + '">' +
                '<div class="preset-name">' + escapePackageHtml(packageName) + '</div>' +
                '<div class="preset-price"><span class="preset-currency">S$</span>' + price.toFixed(2) + ' <span>/ pax</span></div>' +
                '<div class="preset-description" title="' + escapePackageHtml(description) + '">' + escapePackageHtml(description) + '</div>' +
                '<button type="button" data-package-name="' + escapePackageHtml(packageName) + '" onclick="showPackageDetails(' + packageId + ', this.getAttribute(\'data-package-name\'))" class="btn ' + buttonClass + ' btn-sm preset-action"' + (isActive ? '' : ' disabled') + '>' + buttonText + '</button>' +
                '</article>';
        }).join('');
    }
    $('#packageCards').html(html);
}

function showPackageDetails(packageId, packageName) {
    if (!packageId) return;

    ensurePackageDetailModal();

    $('#packageDetailTitle').text(packageName);
    $('#packageDetailContent').html('<div class="package-detail-status">Loading package menu...</div>');
    $('#packageDetailModal').addClass('open').attr('aria-hidden', 'false');
    $('body').addClass('package-modal-open');

    $.getJSON('/Customer/Packages/get/' + packageId + '/categories').done(function (categories) {
        categories = Array.isArray(categories) ? categories : [];
        if (!categories.length) {
            $('#packageDetailContent').html('<div class="package-detail-status">No categories are configured for this package.</div>');
            return;
        }

        var requests = categories.map(function (category) {
            var categoryId = Number(category.categoryId || category.CategoryId || 0);
            return $.getJSON('/Customer/Packages/categories/' + categoryId + '/menus').then(
                function (menus) { return { category: category, menus: Array.isArray(menus) ? menus : [] }; },
                function () { return { category: category, menus: [], failed: true }; }
            );
        });

        $.when.apply($, requests).done(function () {
            var results = requests.length === 1 ? [arguments[0]] : Array.prototype.slice.call(arguments);
            renderPackageDetails(results);
        });
    }).fail(function () {
        $('#packageDetailContent').html('<div class="package-detail-status error">Unable to load this package menu.</div>');
    });
}

function renderPackageDetails(results) {
    var html = '<div class="package-category-grid">';
    results.forEach(function (result) {
        var category = result.category || {};
        var menus = result.menus || [];
        var categoryName = category.categoryName || category.CategoryName || 'Category';
        html += '<section class="package-category-card"><h3>' + escapePackageHtml(categoryName) + '</h3><ul>';
        if (menus.length) {
            menus.forEach(function (menu) {
                html += '<li>' + escapePackageHtml(menu.name || menu.Name || '') + '</li>';
            });
        } else {
            html += '<li class="empty">' + (result.failed ? 'Unable to load menu items.' : 'No menu items available.') + '</li>';
        }
        html += '</ul></section>';
    });
    html += '</div>';
    $('#packageDetailContent').html(html);
}

function closePackageDetails() {
    $('#packageDetailModal').removeClass('open').attr('aria-hidden', 'true');
    $('body').removeClass('package-modal-open');
}

function escapePackageHtml(value) {
    return $('<div>').text(value || '').html();
}
