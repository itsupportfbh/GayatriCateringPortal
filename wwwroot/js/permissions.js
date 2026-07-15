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
        if (!permission) return;
        if (selectors && selectors.length) {
            $(root).find(selectors.join(', ')).toggle(!!permission);
        }
    }

    function applyPermissionVisibility(root) {
        var $root = root ? $(root) : $(document);
        var permission = findPermissionsForCurrentEntity();
        if (!permission) return;

        var canCreate = !!(permission.create || permission.Create);
        var canEdit = !!(permission.edit || permission.Edit);
        var canDelete = !!(permission.delete || permission.Delete);
        var canActiveInactive = !!(permission.activeInActive || permission.ActiveInActive);
        var canDownload = !!(permission.download || permission.Download);
        var canPrint = !!(permission.print || permission.Print);

        hideIfNeeded($root, canCreate, [
            '.btn-add',
            '.btn-create',
            '[data-permission="create"]',
            '[id^="btnAdd"]',
            '[id*="Add"]'
        ]);

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

        hideIfNeeded($root, canEdit, [
            '.btn-role-permission',
            '[data-permission="rolepermission"]'
        ]);

        hideIfNeeded($root, canDelete, [
            '.btn-delete',
            '[data-permission="delete"]'
        ]);

        hideIfNeeded($root, canActiveInactive, [
            '.btn-toggle',
            '.btn-set-active',
            '.btn-set-inactive',
            '[data-permission="activeinactive"]'
        ]);

        hideIfNeeded($root, canDownload, [
            '.btn-export',
            '.btn-download',
            '.js-export-trigger',
            '.js-export-excel',
            '.js-export-pdf',
            '[data-permission="download"]'
        ]);

        hideIfNeeded($root, canPrint, [
            '.btn-print',
            '.js-print-page',
            '.js-print-invoice',
            '[data-permission="print"]'
        ]);

        var canSubmit = canCreate || canEdit;
        hideIfNeeded($root, canSubmit, [
            '[id^="btnSave"]',
            '[id^="save"]',
            '[data-permission="save"]'
        ]);

        if (!canSubmit) {
            $root.find('button, a.btn').each(function () {
                var $el = $(this);
                var text = ($el.text() || '').toLowerCase().replace(/\s+/g, ' ').trim();
                var id = ($el.attr('id') || '').toLowerCase();
                if (id.indexOf('save') === 0 || text === 'save' || text.indexOf('save ') === 0 || text === 'update' || text.indexOf('update ') === 0) {
                    $el.hide();
                }
            });
        }
    }

    function loadCurrentRolePermissions() {
        var roleId = getCurrentRoleId();
        if (!roleId) return $.Deferred().resolve().promise();

        return $.ajax({
            url: '/Common/GetRolePermissionsByRoleId?roleId=' + encodeURIComponent(roleId),
            type: 'GET',
            dataType: 'json'
        }).done(function (rows) {
            sessionStorage.setItem('gcRolePermissions', JSON.stringify(Array.isArray(rows) ? rows : []));
            applyPermissionVisibility(document);
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

        $.when(
            $.ajax({
                url: '/Common/menus?roleId=' + encodeURIComponent(userRoleId),
                type: 'GET',
                dataType: 'json'
            }),
            $.ajax({
                url: '/Common/GetRolePermissionsByRoleId?roleId=' + encodeURIComponent(userRoleId),
                type: 'GET',
                dataType: 'json'
            })
        ).done(function (menuResponse, permissionResponse) {
            var groups = menuResponse && menuResponse[0] ? menuResponse[0] : [];
            var permissions = permissionResponse && permissionResponse[0] ? permissionResponse[0] : [];

            sessionStorage.setItem('gcRolePermissions', JSON.stringify(Array.isArray(permissions) ? permissions : []));

            var route = '';
            var entityNo = 0;
            var menuName = '';

            if (Array.isArray(groups) && Array.isArray(permissions)) {
                for (var gi = 0; gi < groups.length && !route; gi++) {
                    var menus = groups[gi] && (groups[gi].menus || groups[gi].Menus) || [];
                    for (var mi = 0; mi < menus.length; mi++) {
                        var menu = menus[mi] || {};
                        var menuEntityNo = toInt(menu.entityNo || menu.EntityNo || 0);
                        var routeValue = (menu.route || menu.Route || '').trim();
                        var menuPermission = null;

                        for (var pi = 0; pi < permissions.length; pi++) {
                            var permission = permissions[pi] || {};
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

            if (!route && Array.isArray(groups)) {
                for (var gi2 = 0; gi2 < groups.length && !route; gi2++) {
                    var menus2 = groups[gi2] && (groups[gi2].menus || groups[gi2].Menus) || [];
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
        }).fail(function () {
            window.location.href = '/Customer/Home';
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