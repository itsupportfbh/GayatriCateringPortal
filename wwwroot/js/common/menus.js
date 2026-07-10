document.addEventListener('DOMContentLoaded', function () {
// Simple jQuery menu loader to match the project's style
$(document).ready(function () {
    if (!$('#sidebarDynamic').length) return;

    $.ajax({
        url: '/Common/menus',
        type: 'GET',
        dataType: 'json',
        success: function (groups) {

            console.debug('menus: received', groups);
            var page = $('body').attr('data-page') || '';
            var html = '';
            if (Array.isArray(groups) && groups.length) {
                for (var gi = 0; gi < groups.length; gi++) {
                    var g = groups[gi];
                    var groupName = g.name || g.Name || '';
                    html += '<div class="sidebar-section">' + groupName + '</div>';
                    var menus = g.menus || g.Menus || [];
                   
                    for (var i = 0; i < menus.length; i++) {
                        var m = menus[i];
                        var route = m.route || '#';
                        var name = m.name || '';
                        var icon = m.menuIcon|| '';
                        var active = false;
                        if (page && route && route.toLowerCase().indexOf(page.toLowerCase()) !== -1) active = true;
                        if (!active && route && window.location.pathname.toLowerCase() === route.toLowerCase()) active = true;
                        html += '<a class="sidebar-item' + (active ? ' active' : '') + '" href="' + route + '"><span class="icon">' + icon + '</span> ' + name + '</a>';
                    }
                }
            }
            if (!html) {
                html = '<div class="sidebar-section">Menu</div><div class="sidebar-item">No menu items found</div>';
            }
            $('#sidebarDynamic').html(html);
        },
        error: function (err) {
            console.error('Unable to load menus', err);
            $('#sidebarDynamic').text('Menu load failed');
        }
    });
});

// close DOMContentLoaded listener
});
