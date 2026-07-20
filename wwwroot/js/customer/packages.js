$(document).ready(function () {
    loadPackages();

    $(document).on('click', '.package-view-btn', function () {
        var packageId = Number($(this).data('package-id')) || 0;
        var packageName = String($(this).data('package-name') || 'Package');
        if (!packageId || $(this).prop('disabled')) {
            return;
        }

        $('.package-view-btn').removeClass('is-active');
        $(this).addClass('is-active');
        showPackageDetails(packageId, packageName);
    });
});

function loadPackages() {
    $('#packageCards').html(
        '<div class="card package-loading-card">' +
        '<div class="pageloaderpanel">' +
        '<div class="spinner" aria-hidden="true"></div>' +
        '<div class="loader-text">Loading packages...</div>' +
        '</div>' +
        '</div>'
    );

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
                '<button type="button" data-package-id="' + packageId + '" data-package-name="' + escapePackageHtml(packageName) + '" class="btn ' + buttonClass + ' btn-sm preset-action package-view-btn"' + (isActive ? '' : ' disabled') + '>' + buttonText + '</button>' +
                '</article>';
        }).join('');
    }
    $('#packageCards').html(html);
}

function showPackageDetails(packageId, packageName) {
    if (!packageId) return;

    $('#packageDetailTitle').text(packageName);
    $('#packageDetailMeta').html('<span class="meta-pill">Loading...</span>');
    $('#packageDetailContent').html(buildDetailsSkeleton());
    $('#packageSidebar').addClass('is-open');

    $.getJSON('/Customer/Packages/get/' + packageId + '/categories').done(function (categories) {
        categories = Array.isArray(categories) ? categories : [];
        if (!categories.length) {
            $('#packageDetailMeta').html('<span class="meta-pill">0 categories</span><span class="meta-pill">0 items</span>');
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
        $('#packageDetailMeta').html('<span class="meta-pill">Unavailable</span>');
        $('#packageDetailContent').html('<div class="package-detail-status error">Unable to load this package menu.</div>');
    });
}

function renderPackageDetails(results) {
    var categoryCount = results.length;
    var menuCount = 0;
    var cardsHtml = '';

    results.forEach(function (result, index) {
        var category = result.category || {};
        var menus = result.menus || [];
        var categoryName = category.categoryName || category.CategoryName || 'Category';
        menuCount += menus.length;

        cardsHtml += '<section class="package-category-card" style="--stagger:' + index + '">' +
            '<div class="package-category-head">' +
            '<h3>' + escapePackageHtml(categoryName) + '</h3>' +
            '<span class="category-count">' + menus.length + ' item' + (menus.length === 1 ? '' : 's') + '</span>' +
            '</div><ul>';
        if (menus.length) {
            menus.forEach(function (menu) {
                cardsHtml += '<li>' + escapePackageHtml(menu.name || menu.Name || '') + '</li>';
            });
        } else {
            cardsHtml += '<li class="empty">' + (result.failed ? 'Unable to load menu items.' : 'No menu items available.') + '</li>';
        }
        cardsHtml += '</ul></section>';
    });

    var html = '<div class="package-category-grid">' + cardsHtml + '</div>';

    $('#packageDetailMeta').html(
        '<span class="meta-pill">' + categoryCount + ' categor' + (categoryCount === 1 ? 'y' : 'ies') + '</span>' +
        '<span class="meta-pill">' + menuCount + ' menu item' + (menuCount === 1 ? '' : 's') + '</span>'
    );
    $('#packageDetailContent').html(html);
}

function buildDetailsSkeleton() {
    var blocks = [0, 1, 2].map(function () {
        return '<section class="details-skeleton-card">' +
            '<div class="details-skeleton-head shimmer"></div>' +
            '<div class="details-skeleton-lines">' +
            '<span class="shimmer"></span>' +
            '<span class="shimmer"></span>' +
            '<span class="shimmer short"></span>' +
            '</div>' +
            '</section>';
    }).join('');

    return '<div class="details-skeleton-wrap" aria-hidden="true">' + blocks + '</div>';
}

function escapePackageHtml(value) {
    return $('<div>').text(value || '').html();
}
