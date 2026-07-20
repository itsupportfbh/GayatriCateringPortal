// ===== CUSTOMER MENU =====
$(function () {
    loadCategoryMenus();

    function loadCategoryMenus() {
        $.getJSON('/Customer/Menu/get').done(function (categories) {
            renderCategoryMenus(Array.isArray(categories) ? categories : []);
        }).fail(function () {
            $('#menuSections').html('<div class="card"><p class="muted">Unable to load menu items right now.</p></div>');
        });
    }

    function renderCategoryMenus(categories) {
        if (!categories.length) {
            $('#menuSections').html('<div class="card"><p class="muted">No menu items are available right now.</p></div>');
            return;
        }

        var html = '<div class="menu-sections">';
        categories.forEach(function (category) {
            var items = Array.isArray(category.items) ? category.items : [];
            html += '<section class="menu-section-card">' +
                '<div class="menu-section-header"><div class="menu-section-title">' + escapeMenuHtml(category.name) + '</div></div>' +
                '<div class="category-menu-list">';

            items.forEach(function (item) {
                html += '<div class="category-menu-name">' + escapeMenuHtml(item.name) + '</div>';
            });

            html += '</div></section>';
        });
        html += '</div>';
        $('#menuSections').html(html);
    }

    function escapeMenuHtml(value) {
        return $('<div>').text(value || '').html();
    }
});
