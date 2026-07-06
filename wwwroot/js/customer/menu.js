// ===== CUSTOMER MENU =====
$(function () {
    var sections = [
        {
            title: 'Breakfast (Vegetarian)',
            items: [
                { name: 'Breakfast Menu 1', price: 9, tag: 'Veg', dishes: ['Idly', 'Veg Pongal', 'Medhu Vada', 'Kesari', 'Coffee or Tea', 'Sambar', 'Coconut Chutney', 'Kara Chutney', 'Lime Juice'] },
                { name: 'Breakfast Menu 2', price: 10, tag: 'Veg', dishes: ['Idly', 'Masala Uthappam', 'Mysore Bonda', 'Paruppu Payasam', 'Coffee or Tea', 'Sambar', 'Coconut Chutney', 'Kara Chutney', 'Lime Juice'] },
                { name: 'Breakfast Menu 3', price: 11, tag: 'Veg', dishes: ['Idly', 'Podi Uthappam', 'Masala Vada', 'Gulab Jamun', 'Kesari', 'Coffee or Tea', 'Sambar', 'Coconut Chutney', 'Kara Chutney', 'Lime Juice'] }
            ]
        },
        {
            title: 'Hi-Tea (Vegetarian)',
            items: [
                { name: 'Hi-Tea Menu 1', price: 10, tag: 'Veg', dishes: ['Katti Veg Roll', 'Curry Puff', 'Veg Bee Hoon'] },
                { name: 'Hi-Tea Menu 2', price: 11, tag: 'Veg', dishes: ['Vada Pav', 'Prata Pizza', 'Boiled Masala Peanut'] },
                { name: 'Hi-Tea Menu 3', price: 12, tag: 'Veg', dishes: ['Bombay Sandwich', 'Mysore Bonda', 'Veg Cutlet'] }
            ]
        }
    ];

    var html = '<div class="menu-sections">';
    sections.forEach(function (section) {
        html += '<div class="menu-section-card"><div class="menu-section-title">' + section.title + '</div><div class="menu-package-grid">';
        section.items.forEach(function (item) {
            html += '<div class="menu-package-card">' +
                '<div class="menu-package-title">' + item.name + '</div>' +
                '<div class="menu-package-price">S$' + item.price + '<span>/pax</span></div>' +
                '<span class="menu-package-tag">' + item.tag + '</span>' +
                '<ul class="menu-package-list">' + item.dishes.map(function (dish) { return '<li>' + dish + '</li>'; }).join('') + '</ul>' +
                '</div>';
        });
        html += '</div></div>';
    });
    html += '</div>';
    $('#menuSections').html(html);
});
