$(document).ready(function () {
    loadPackages();
});

function loadPackages() {
    $.ajax({
        url: "/Customer/Packages/get",
        type: "GET",
        success: function (data) {
            renderPackages(data);
        },
        error: function () {
            renderPackages([]);
        }
    });
}

function renderPackages(packages) {
    var html = '';
    if (!Array.isArray(packages) || packages.length === 0) {
        html = '<div class="card"><p class="muted">No packages available right now. Please check back later.</p></div>';
    } else {
        html = packages.map(function (item) {
            var price = parseFloat(item.price || item.Price || 0) || 0;
            var description = item.packageDescription || item.PackageDescription || item.packageType || item.PackageType || 'A catering package with event setup options.';
            var packageName = item.packageName || item.PackageName || 'Package';
            var isActive = item.isActive === '1' || item.isActive === 'true' || item.isActive === true || item.IsActive === '1' || item.IsActive === 'true' || item.IsActive === true;
            var buttonClass = isActive ? 'btn-orange' : 'btn-light disabled';
            var buttonText = isActive ? 'Order This' : 'Unavailable';

            return '<div class="preset-card' + (isActive ? '' : ' muted') + '">' +
                '<div class="preset-name">' + packageName + '</div>' +
                '<div class="preset-price">S$' + price.toFixed(2) + ' <span>/pax</span></div>' +
                '<ul class="preset-items"><li>' + description + '</li></ul>' +
                '<a href="/Customer/Order" class="btn ' + buttonClass + ' btn-sm">' + buttonText + '</a>' +
                '</div>';
        }).join('');
    }
    $('#packageCards').html(html);
}
