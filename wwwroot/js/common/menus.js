// Simple jQuery menu loader to match the project's style
$(document).ready(function () {
    if (!$('#sidebarDynamic').length) return;

    var roleId = 0;
    if (typeof window.getCurrentRoleId === 'function') {
        roleId = parseInt(window.getCurrentRoleId() || '0', 10) || 0;
    }

    $.ajax({
        url: '/Common/menus?roleId=' + encodeURIComponent(roleId),
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
                        var entityNo = m.entityNo || m.EntityNo || 0;
                        var active = false;
                        if (page && route && route.toLowerCase().indexOf(page.toLowerCase()) !== -1) active = true;
                        if (!active && route && window.location.pathname.toLowerCase() === route.toLowerCase()) active = true;
                        html += '<a class="sidebar-item' + (active ? ' active' : '') + '" href="' + route + '" data-entity-no="' + entityNo + '" data-menu-name="' + name + '"><span class="icon">' + icon + '</span> ' + name + '</a>';
                    }
                }
            }
            if (!html) {
                html = '<div class="sidebar-section">Menu</div><div class="sidebar-item">No menu items found</div>';
            }
            $('#sidebarDynamic').html(html);

            $('#sidebarDynamic .sidebar-item').off('click.menucontext').on('click.menucontext', function () {
                var entityNo = parseInt($(this).data('entity-no') || '0', 10) || 0;
                var route = $(this).attr('href') || '';
                var menuName = $(this).data('menu-name') || '';
                if (entityNo > 0 && window.storeCurrentMenuContext) {
                    window.storeCurrentMenuContext(entityNo, route, menuName);
                    if (window.applyPermissionVisibility) {
                        window.applyPermissionVisibility(document);
                    }
                }
            });

            var $active = $('#sidebarDynamic .sidebar-item.active').first();
            if ($active.length && window.storeCurrentMenuContext) {
                var activeEntityNo = parseInt($active.data('entity-no') || '0', 10) || 0;
                var activeRoute = $active.attr('href') || '';
                var activeName = $active.data('menu-name') || '';
                if (activeEntityNo > 0) {
                    window.storeCurrentMenuContext(activeEntityNo, activeRoute, activeName);
                    if (window.applyPermissionVisibility) {
                        window.applyPermissionVisibility(document);
                    }
                }
            }
        },
        error: function (err) {
            console.error('Unable to load menus', err);
            $('#sidebarDynamic').text('Menu load failed');
        }
    });
});
