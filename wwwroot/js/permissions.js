(function () {
    function toInt(value) {
        var parsed = parseInt(value, 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    function getCurrentUserId() {
        var user = getUserDetails() || {};
        return toInt(user.userId || 0);
    }

    function getCurrentRoleId() {
        var user = getUserDetails() || {};
        return toInt(user.roleId || 0);
    }

    function getCurrentEntityNo() {
        return toInt(sessionStorage.getItem('gcCurrentEntityNo') || '0');
    }

    function getStoredPermissions() {
        try {
            var raw = sessionStorage.getItem('gcRolePermissions') || '[]';
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function storeCurrentMenuContext(entityNo, route, menuName) {
        if (entityNo && entityNo > 0) {
            sessionStorage.setItem('gcCurrentEntityNo', String(entityNo));
        }
        if (route) {
            sessionStorage.setItem('gcCurrentMenuRoute', route);
        }
        if (menuName) {
            sessionStorage.setItem('gcCurrentMenuName', menuName);
        }
    }

    function findPermissionsForCurrentEntity() {
        var entityNo = getCurrentEntityNo();
        if (!entityNo) return null;

        var permissions = getStoredPermissions();
        for (var i = 0; i < permissions.length; i++) {
            var item = permissions[i] || {};
            var itemEntityNo = toInt(item.entityNo || item.EntityNo || 0);
            if (itemEntityNo === entityNo) {
                return item;
            }
        }

        return null;
    }

    function hideIfNeeded(root, permission, selectors) {
        if (selectors && selectors.length) {
            $(root).find(selectors.join(', ')).toggle(!!permission);
        }
    }

    function toggleByHeuristic(root, permission, matcher) {
        var $root = root ? $(root) : $(document);
        var $candidates = $root.find('button, a.btn, .action-item, .dropdown-item');

        $candidates.each(function () {
            var $el = $(this);
            var text = ($el.text() || '').toLowerCase().replace(/\s+/g, ' ').trim();
            var id = ($el.attr('id') || '').toLowerCase();
            var cls = ($el.attr('class') || '').toLowerCase();
            var onclick = ($el.attr('onclick') || '').toLowerCase();
            var title = ($el.attr('title') || '').toLowerCase();
            var aria = ($el.attr('aria-label') || '').toLowerCase();

            if (typeof matcher === 'function' && matcher({ text: text, id: id, cls: cls, onclick: onclick, title: title, aria: aria })) {
                $el.toggle(!!permission);
            }
        });
    }

    function applyPermissionVisibility(root) {
        var $root = root ? $(root) : $(document);
        var permission = findPermissionsForCurrentEntity();

        // Secure default: when permission context is unavailable, keep protected actions hidden.
        var canCreate = !!(permission && (permission.create || permission.Create));
        var canEdit = !!(permission && (permission.edit || permission.Edit));
        var canDelete = !!(permission && (permission.delete || permission.Delete));
        var canActiveInactive = !!(permission && (permission.activeInActive || permission.ActiveInActive || permission.activeInactive || permission.ActiveInactive));
        var canDownload = !!(permission && (permission.download || permission.Download));
        var canPrint = !!(permission && (permission.print || permission.Print));

        hideIfNeeded($root, canCreate, [
            '.btn-add',
            '.btn-create',
            '[data-permission="create"]',
            '[id^="btnAdd"]',
            '[id*="Add"]'
        ]);

        toggleByHeuristic($root, canCreate, function (v) {
            return v.text === 'add' || v.text.indexOf('+ add') === 0 || v.text.indexOf('add ') === 0 || v.text.indexOf('new ') === 0 || v.text.indexOf('create') === 0 || v.id.indexOf('add') > -1 || v.id.indexOf('create') > -1 || v.cls.indexOf('btn-add') > -1 || v.cls.indexOf('btn-create') > -1;
        });

        if (!canCreate) {
            $root.find('button, a.btn').each(function () {
                var $el = $(this);
                var text = ($el.text() || '').toLowerCase().replace(/\s+/g, ' ').trim();
                var id = ($el.attr('id') || '').toLowerCase();
                var onclick = ($el.attr('onclick') || '').toLowerCase();

                var looksLikeCreateAction = text.indexOf('+ add') === 0 || text.indexOf('add ') === 0 || text === 'add' || text.indexOf('new ') === 0 || id.indexOf('btnadd') === 0 || id.indexOf('add') > -1 || (onclick.indexOf('open') > -1 && text.indexOf('add') > -1);
                if (looksLikeCreateAction) {
                    $el.hide();
                }
            });
        }

        hideIfNeeded($root, canEdit, [
            '.btn-edit',
            '[data-permission="edit"]'
        ]);

        toggleByHeuristic($root, canEdit, function (v) {
            if (v.text.indexOf('role permission') > -1 || v.cls.indexOf('btn-role-permission') > -1) {
                return false;
            }
            return v.text === 'edit' || v.text.indexOf('edit ') === 0 || v.id.indexOf('edit') > -1 || v.cls.indexOf('btn-edit') > -1 || v.onclick.indexOf('edit') > -1;
        });

        hideIfNeeded($root, canDelete, [
            '.btn-delete',
            '[data-permission="delete"]'
        ]);

        toggleByHeuristic($root, canDelete, function (v) {
            return v.text === 'delete' || v.text.indexOf('delete ') === 0 || v.text === 'remove' || v.id.indexOf('delete') > -1 || v.cls.indexOf('btn-delete') > -1 || v.onclick.indexOf('delete') > -1 || v.onclick.indexOf('remove') > -1;
        });

        hideIfNeeded($root, canActiveInactive, [
            '.btn-toggle',
            '.btn-set-active',
            '.btn-set-inactive',
            '[data-permission="activeinactive"]'
        ]);

        toggleByHeuristic($root, canActiveInactive, function (v) {
            return v.text === 'active' || v.text === 'inactive' || v.text.indexOf('activate') === 0 || v.text.indexOf('deactivate') === 0 || v.cls.indexOf('btn-toggle') > -1 || v.cls.indexOf('btn-set-active') > -1 || v.cls.indexOf('btn-set-inactive') > -1 || v.onclick.indexOf('set') > -1 && v.onclick.indexOf('active') > -1;
        });

        hideIfNeeded($root, canDownload, [
            '.btn-export',
            '.btn-download',
            '.js-export-trigger',
            '.js-export-excel',
            '.js-export-pdf',
            '[data-permission="download"]'
        ]);

        toggleByHeuristic($root, canDownload, function (v) {
            return v.text === 'export' || v.text.indexOf('export ') === 0 || v.text.indexOf('download') === 0 || v.text.indexOf('excel') > -1 || v.text.indexOf('pdf') > -1 || v.id.indexOf('export') > -1 || v.id.indexOf('download') > -1 || v.cls.indexOf('btn-export') > -1 || v.cls.indexOf('btn-download') > -1 || v.title.indexOf('export') > -1 || v.aria.indexOf('export') > -1;
        });

        hideIfNeeded($root, canPrint, [
            '.btn-print',
            '.js-print-page',
            '.js-print-invoice',
            '[data-permission="print"]'
        ]);

        toggleByHeuristic($root, canPrint, function (v) {
            return v.text === 'print' || v.text.indexOf('print ') === 0 || v.id.indexOf('print') > -1 || v.cls.indexOf('btn-print') > -1 || v.title.indexOf('print') > -1 || v.aria.indexOf('print') > -1;
        });

    }

    function loadCurrentRolePermissions() {
        var roleId = getCurrentRoleId();
        if (!roleId) return $.Deferred().resolve().promise();

        return $.ajax({
            url: '/Common/GetRolePermissionsByRoleId?roleId=' + encodeURIComponent(roleId),
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                sessionStorage.setItem('gcRolePermissions', JSON.stringify(Array.isArray(rows) ? rows : []));
                applyPermissionVisibility(document);
            }
        });
    }

    function redirectAfterLogin(context) {
        var userRoleId = toInt(context && context.roleId);

        if (!userRoleId) {
            userRoleId = getCurrentRoleId();
        }

        if (typeof window.updateUserDetails === 'function') {
            window.updateUserDetails({ roleId: userRoleId || 0 });
        } else {
            var currentUser = getUserDetails();
            currentUser.roleId = userRoleId || 0;
            localStorage.setItem('UserDetails', JSON.stringify(currentUser));
        }

        if (!userRoleId) {
            window.location.href = '/Customer/Home';
            return;
        }

        $.ajax({
            url: '/Common/menus?roleId=' + encodeURIComponent(userRoleId),
            type: 'GET',
            dataType: 'json',
            success: function (groups) {
                var menuGroups = Array.isArray(groups) ? groups : [];

                $.ajax({
                    url: '/Common/GetRolePermissionsByRoleId?roleId=' + encodeURIComponent(userRoleId),
                    type: 'GET',
                    dataType: 'json',
                    success: function (permissions) {
                        var permissionRows = Array.isArray(permissions) ? permissions : [];
                        sessionStorage.setItem('gcRolePermissions', JSON.stringify(permissionRows));

                        var route = '';
                        var entityNo = 0;
                        var menuName = '';

                        if (Array.isArray(menuGroups) && Array.isArray(permissionRows)) {
                            for (var gi = 0; gi < menuGroups.length && !route; gi++) {
                                var menus = menuGroups[gi] && (menuGroups[gi].menus || menuGroups[gi].Menus) || [];
                                for (var mi = 0; mi < menus.length; mi++) {
                                    var menu = menus[mi] || {};
                                    var menuEntityNo = toInt(menu.entityNo || menu.EntityNo || 0);
                                    var routeValue = (menu.route || menu.Route || '').trim();
                                    var menuPermission = null;

                                    for (var pi = 0; pi < permissionRows.length; pi++) {
                                        var permission = permissionRows[pi] || {};
                                        if (toInt(permission.entityNo || permission.EntityNo || 0) === menuEntityNo) {
                                            menuPermission = permission;
                                            break;
                                        }
                                    }

                                    var canView = !!(menuPermission && (menuPermission.view || menuPermission.View));
                                    if (routeValue && canView) {
                                        route = routeValue;
                                        entityNo = menuEntityNo;
                                        menuName = menu.name || menu.Name || '';
                                        break;
                                    }
                                }
                            }
                        }

                        if (!route && Array.isArray(menuGroups)) {
                            for (var gi2 = 0; gi2 < menuGroups.length && !route; gi2++) {
                                var menus2 = menuGroups[gi2] && (menuGroups[gi2].menus || menuGroups[gi2].Menus) || [];
                                for (var mi2 = 0; mi2 < menus2.length; mi2++) {
                                    var menu2 = menus2[mi2] || {};
                                    route = (menu2.route || menu2.Route || '').trim();
                                    entityNo = toInt(menu2.entityNo || menu2.EntityNo || 0);
                                    menuName = menu2.name || menu2.Name || '';
                                    if (route) break;
                                }
                            }
                        }

                        if (!route) {
                            route = '/Customer/Home';
                        }

                        if (route.indexOf('/Admin') === 0) {
                            storeCurrentMenuContext(entityNo, route, menuName);
                        }

                        window.location.href = route;
                    },
                    error: function () {
                        window.location.href = '/Customer/Home';
                    }
                });
            },
            error: function () {
                window.location.href = '/Customer/Home';
            }
        });
    }

    function bootstrapPermissions() {
        loadCurrentRolePermissions();
        applyPermissionVisibility(document);
    }

    document.addEventListener('DOMContentLoaded', bootstrapPermissions);

    var permissionObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            if (mutation.addedNodes && mutation.addedNodes.length) {
                applyPermissionVisibility(document);
                break;
            }
        }
    });

    permissionObserver.observe(document.documentElement, { childList: true, subtree: true });

    window.getCurrentUserId = getCurrentUserId;
    window.getCurrentRoleId = getCurrentRoleId;
    window.getCurrentEntityNo = getCurrentEntityNo;
    window.storeCurrentMenuContext = storeCurrentMenuContext;
    window.loadCurrentRolePermissions = loadCurrentRolePermissions;
    window.applyPermissionVisibility = applyPermissionVisibility;
    window.redirectAfterLogin = redirectAfterLogin;
})();