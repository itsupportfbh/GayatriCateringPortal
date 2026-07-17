// ===== SHARED UTILITIES =====

function showToast(msg, duration, options) {
    // options: { confirm: boolean, yesText: string, noText: string, onYes: fn, onNo: fn, type: 'success'|'error'|'info'|'warning', title: string }
    var container = document.getElementById('toast');
    if (!container) return;

    function removeItem(el) {
        el.classList.remove('show');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }

    var type = options && options.type ? options.type : null;
    if (options && options.confirm) {
        // single confirm toast item (not stacked) with normal toast layout
        var confirmType = type || 'warning';
        var item = document.createElement('div');
        item.className = 'toast-item toast-item-confirm toast-item-' + confirmType + ' show';

        var row = document.createElement('div');
        row.className = 'toast-row';

        var icon = document.createElement('div');
        icon.className = 'toast-icon';
        var iconText = '';
        switch (confirmType) {
            case 'success': iconText = '\u2714'; break;
            case 'error': iconText = '\u26A0'; break;
            case 'info': iconText = '\u2139'; break;
            case 'warning': iconText = '\u26A0'; break;
            default: iconText = '';
        }
        icon.textContent = iconText;

        var body = document.createElement('div');
        if (options.title) {
            var titleEl = document.createElement('div');
            titleEl.className = 'toast-title';
            titleEl.textContent = options.title;
            body.appendChild(titleEl);
        }
        var txt = document.createElement('div');
        txt.className = 'toast-text';
        txt.textContent = msg;
        body.appendChild(txt);

        row.appendChild(icon);
        row.appendChild(body);
        item.appendChild(row);

        var actions = document.createElement('div');
        actions.className = 'toast-actions';

        var yes = document.createElement('button');
        yes.className = 'toast-btn toast-yes';
        yes.textContent = options.yesText || 'Yes';
        yes.addEventListener('click', function () {
            removeItem(item);
            if (typeof options.onYes === 'function') options.onYes();
        });

        var no = document.createElement('button');
        no.className = 'toast-btn toast-no' + (confirmType === 'warning' ? ' toast-no-warning' : '');
        no.textContent = options.noText || 'No';
        no.addEventListener('click', function () {
            removeItem(item);
            if (typeof options.onNo === 'function') options.onNo();
        });

        actions.appendChild(yes);
        actions.appendChild(no);
        item.appendChild(actions);

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'toast-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function () {
            removeItem(item);
        });
        item.appendChild(closeBtn);

        // replace any existing confirm item
        var existing = container.querySelector('.toast-item-confirm');
        if (existing) existing.parentNode.removeChild(existing);
        container.appendChild(item);

        if (duration && typeof duration === 'number' && duration > 0) {
            setTimeout(function () { removeItem(item); }, duration);
        }
        return;
    }

    // normal stacked toast
    var title = options && options.title ? options.title : null;

    var item = document.createElement('div');
    item.className = 'toast-item' + (type ? ' toast-item-' + type : '');

    var row = document.createElement('div');
    row.className = 'toast-row';

    var icon = document.createElement('div');
    icon.className = 'toast-icon';
    var iconText = '';
    switch (type) {
        case 'success': iconText = '\u2714'; break;
        case 'error': iconText = '\u26A0'; break;
        case 'info': iconText = '\u2139'; break;
        case 'warning': iconText = '\u26A0'; break;
        default: iconText = '';
    }
    icon.textContent = iconText;

    var body = document.createElement('div');
    var titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title || (type ? (type.charAt(0).toUpperCase() + type.slice(1) + '!') : '');
    var msgEl = document.createElement('div');
    msgEl.className = 'toast-message';
    msgEl.textContent = msg;

    if (titleEl.textContent) body.appendChild(titleEl);
    body.appendChild(msgEl);

    row.appendChild(icon);
    row.appendChild(body);
    item.appendChild(row);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'toast-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', function () {
        removeItem(item);
    });
    item.appendChild(closeBtn);

    container.appendChild(item);

    // force layout then show
    setTimeout(function () { item.classList.add('show'); }, 10);

    if (!(options && options.confirm)) {
        setTimeout(function () { removeItem(item); }, duration || 4000);
    }
}

function hideToast() {
    var t = document.getElementById('toast');
    if (!t) return;
    t.classList.remove('show');
    setTimeout(function () { t.innerHTML = ''; }, 300);
}

function openModal(html) {
    var c = document.getElementById('modalContainer');
    if (!c) return;
    c.innerHTML = html;
}

function closeModal() {
    var c = document.getElementById('modalContainer');
    if (c) c.innerHTML = '';
}

function openLogin() {
    document.getElementById('loginModal').classList.add('open');
    if (window.LoginProcess && typeof window.LoginProcess.reset === 'function') {
        window.LoginProcess.reset();
    }
    setTimeout(function () {
        var el = document.getElementById('loginEmail');
        if (el) el.focus();
    }, 100);
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('open');
    if (window.LoginProcess && typeof window.LoginProcess.reset === 'function') {
        window.LoginProcess.reset();
    }
}

function normalizeProfileImageUrl(url) {
    var value = (url || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    if (value.indexOf('/') === 0) return value;
    return '/' + value.replace(/^\/+/, '');
}

var USER_DETAILS_KEY = 'UserDetails';

function safeParseJson(raw, fallback) {
    try {
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

function getUserDetails() {
    var details = safeParseJson(localStorage.getItem(USER_DETAILS_KEY), null);
    return details && typeof details === 'object' ? details : null;
}

function setUserDetails(details) {
    var payload = details && typeof details === 'object' ? details : {};
    localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(payload));
    return payload;
}

function updateUserDetails(patch) {
    var current = getUserDetails() || {};
    var next = Object.assign({}, current, patch || {});
    return setUserDetails(next);
}

function getInitials(name, email) {
    var source = (name || '').trim();
    if (!source && email) {
        source = String(email).split('@')[0];
    }

    if (!source) return 'G';

    var parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function renderHeaderProfile() {
    var details = getUserDetails() || {};
    var isLoggedIn = details.isLoggedIn === true;

    var loginBtn = document.getElementById('loginBtn');
    var navProfile = document.getElementById('navProfile');
    var profileName = document.getElementById('navProfileName');
    var profileRole = document.getElementById('navProfileRole');
    var profileEmail = document.getElementById('navProfileEmail');
    var avatarInitials = document.getElementById('navAvatarInitials');
    var avatarImage = document.getElementById('navAvatarImage');

    if (!loginBtn || !navProfile || !profileName || !profileRole || !profileEmail || !avatarInitials || !avatarImage) {
        return;
    }

    if (!isLoggedIn) {
        loginBtn.classList.remove('hidden');
        navProfile.classList.add('hidden');
        avatarImage.classList.add('hidden');
        avatarImage.removeAttribute('src');
        avatarImage.removeAttribute('title');
        avatarInitials.classList.remove('hidden');
        avatarInitials.removeAttribute('title');
        profileName.textContent = 'Guest User';
        profileName.removeAttribute('title');
        profileRole.textContent = 'Guest';
        profileRole.removeAttribute('title');
        profileEmail.textContent = '';
        profileEmail.removeAttribute('title');
        navProfile.removeAttribute('title');
        avatarInitials.textContent = 'G';
        return;
    }

    var userName = details.userName || 'User';
    var userEmail = details.userEmail || '';
    var userRole = details.userRole || 'User';
    var userImage = normalizeProfileImageUrl(details.userImage || '');
    var profileTooltip = userName + ' | ' + userRole + (userEmail ? ' | ' + userEmail : '');

    profileName.textContent = userName;
    profileName.title = userName;
    profileRole.textContent = userRole;
    profileRole.title = userRole;
    profileEmail.textContent = userEmail;
    profileEmail.title = userEmail;
    avatarInitials.textContent = getInitials(userName, userEmail);
    avatarInitials.title = profileTooltip;
    navProfile.title = profileTooltip;

    if (userImage) {
        avatarImage.src = userImage;
        avatarImage.title = profileTooltip;
        avatarImage.classList.remove('hidden');
        avatarInitials.classList.add('hidden');
    } else {
        avatarImage.classList.add('hidden');
        avatarImage.removeAttribute('src');
        avatarImage.removeAttribute('title');
        avatarInitials.classList.remove('hidden');
    }

    loginBtn.classList.add('hidden');
    navProfile.classList.remove('hidden');
}

function updateSidebarToggle() {
    var toggle = document.getElementById('sidebarToggle');
    if (!toggle) return;
    if (document.body.classList.contains('admin-mode')) {
        toggle.style.display = 'inline-flex';
        toggle.textContent = '☰';
        var tooltipText = document.body.classList.contains('sidebar-collapsed') ? 'Open sidebar' : 'Collapse sidebar';
        toggle.title = tooltipText;
        toggle.setAttribute('aria-label', tooltipText);
        toggle.setAttribute('aria-expanded', document.body.classList.contains('sidebar-collapsed') ? 'false' : 'true');
        toggle.dataset.tooltip = tooltipText;
        toggle.classList.toggle('collapsed', document.body.classList.contains('sidebar-collapsed'));
    } else {
        toggle.style.display = 'none';
    }
}

function restoreAppState() {
    var details = getUserDetails() || {};

    if (details.sidebarCollapsed === true) {
        document.body.classList.add('sidebar-collapsed');
    }

    renderHeaderProfile();
    updateSidebarToggle();
}

function clearClientStorageOnEntry() {
    var body = document.body;
    var isCustomerMode = !!(body && body.classList.contains('customer-mode'));

    if (!isCustomerMode) {
        return;
    }

    localStorage.clear();
    sessionStorage.clear();
}

function sendCode() {
    if (window.LoginProcess && typeof window.LoginProcess.sendCode === 'function') {
        window.LoginProcess.sendCode();
        return;
    }

    showToast('Login module is not ready.', 2500, { type: 'warning', title: 'Please wait' });
}

function doSignIn() {
    if (window.LoginProcess && typeof window.LoginProcess.signIn === 'function') {
        window.LoginProcess.signIn();
        return;
    }

    showToast('Login module is not ready.', 2500, { type: 'warning', title: 'Please wait' });
}

function performClientLogout() {
    document.body.classList.remove('sidebar-collapsed');
    localStorage.clear();
    sessionStorage.clear();
    renderHeaderProfile();
    updateSidebarToggle();
    showToast('Logged out', 2200, { type: 'success', title: 'Success' });
    window.location.href = '/Customer/Home';
}

function performLogout() {
    $.ajax({
        url: '/Login/Logout',
        type: 'POST'
    }).always(function () {
        performClientLogout();
    });
}

function doLogout() {
    showToast('Are you sure you want to logout?', 0, {
        confirm: true,
        type: 'warning',
        title: 'Confirm Logout',
        yesText: 'Logout',
        noText: 'Cancel',
        onYes: function () {
            performLogout();
        }
    });
}

function initRichDatePickers(root) {
    if (typeof window.flatpickr !== 'function') return;

    var scope = root || document;
    var dateInputs = scope.querySelectorAll('input[type="date"]:not([data-gc-date-init="true"])');

    dateInputs.forEach(function (input) {
        input.setAttribute('data-gc-date-init', 'true');
        var currentValue = input.value;

        // Switch to text so the custom picker UI is always used instead of browser-native popup.
        input.type = 'text';

        flatpickr(input, {
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd-m-Y',
            allowInput: false,
            clickOpens: true,
            disableMobile: true,
            monthSelectorType: 'static',
            prevArrow: '<span aria-hidden="true">&#8249;</span>',
            nextArrow: '<span aria-hidden="true">&#8250;</span>',
            defaultDate: currentValue || null
        });

        if (input._flatpickr && input._flatpickr.altInput) {
            input._flatpickr.altInput.placeholder = input.getAttribute('placeholder') || 'dd-mm-yyyy';
        }
    });
}

function getButtonLabel($button) {
    return $.trim($button.attr('data-gc-button-label') || $button.clone().children().remove().end().text());
}

function decorateActionButtons(root) {
    var $scope = root ? $(root) : $(document);
    var $buttons = $scope.is('button, a.btn') ? $scope.add($scope.find('button, a.btn')) : $scope.find('button, a.btn');

    $buttons.each(function () {
        var $button = $(this);
        if ($button.data('gcButtonDecorated')) {
            return;
        }

        var label = getButtonLabel($button);
        var lowerLabel = label.toLowerCase();
        var buttonId = ($button.attr('id') || '').toLowerCase();
        var onclick = ($button.attr('onclick') || '').toLowerCase();
        var action = null;

        if (lowerLabel.indexOf('save') === 0 || buttonId.indexOf('save') > -1 || onclick.indexOf('save') > -1) {
            action = 'save';
        } else if (lowerLabel.indexOf('clear') === 0 || buttonId.indexOf('clear') > -1 || onclick.indexOf('clear') > -1) {
            action = 'clear';
        }

        if (!action) {
            return;
        }

        $button.attr('data-gc-button-label', label);
        $button.attr('data-gc-button-action', action);
        $button.addClass('gc-action-btn');

        var icon = action === 'save' ? '💾' : '↺';
        var busyLabel = action === 'save' ? 'Saving...' : 'Clearing...';

        $button.html(
            '<span class="gc-btn-icon" aria-hidden="true">' + icon + '</span>' +
            '<span class="gc-btn-label">' + label + '</span>' +
            '<span class="gc-btn-loader" aria-hidden="true"></span>'
        );

        $button.attr('data-gc-busy-label', busyLabel);
        $button.data('gcButtonDecorated', true);
    });
}

function setActionButtonLabel(buttonRef, label) {
    var $button = $(buttonRef);
    if (!$button.length) return;

    if (!$button.data('gcButtonDecorated')) {
        decorateActionButtons($button);
    }

    $button.attr('data-gc-button-label', label);

    // Ensure stale loading state never leaks into create/edit reopen flows.
    $button.removeClass('is-busy').prop('disabled', false);

    if (!$button.find('.gc-btn-label').length) {
        $button.text(label);
        $button.data('gcButtonDecorated', false);
        decorateActionButtons($button);
        return;
    }

    $button.find('.gc-btn-label').text(label);
}

function setButtonBusy(buttonRef, isBusy, busyLabel) {
    var $button = $(buttonRef);
    if (!$button.length) return;

    if (!$button.data('gcButtonDecorated') || !$button.find('.gc-btn-label').length || !$button.find('.gc-btn-loader').length) {
        $button.data('gcButtonDecorated', false);
        decorateActionButtons($button);
    }

    var label = busyLabel || $button.attr('data-gc-busy-label') || 'Saving...';
    var originalLabel = getButtonLabel($button);

    if (isBusy) {
        if (!$button.attr('data-gc-button-label')) {
            $button.attr('data-gc-button-label', originalLabel);
        }
        $button.addClass('is-busy').prop('disabled', true);
        $button.find('.gc-btn-label').text(label);
        return;
    }

    var restoreLabel = $button.attr('data-gc-button-label') || originalLabel;
    $button.removeClass('is-busy').prop('disabled', false);
    $button.find('.gc-btn-label').text(restoreLabel);
}

function resetBusyActionButtons(root) {
    var $scope = root ? $(root) : $(document);
    var $buttons = $scope.is('.gc-action-btn') ? $scope.add($scope.find('.gc-action-btn')) : $scope.find('.gc-action-btn');

    $buttons.each(function () {
        var $button = $(this);
        if (!$button.hasClass('is-busy')) {
            return;
        }

        var action = ($button.attr('data-gc-button-action') || '').toLowerCase();
        var fallbackLabel = action === 'clear' ? 'Clear' : 'Save';
        var label = $button.attr('data-gc-button-label') || fallbackLabel;

        $button.removeClass('is-busy').prop('disabled', false);

        if ($button.find('.gc-btn-label').length) {
            $button.find('.gc-btn-label').text(label);
        } else {
            $button.text(label);
            $button.data('gcButtonDecorated', false);
            decorateActionButtons($button);
        }
    });
}

function getModalSaveLabel(root) {
    var $root = $(root);
    if (!$root.length) return null;

    var titleText = $.trim(
        $root.find('.modal-title:visible, [id$="-title"]:visible').first().text()
    ).toLowerCase();

    if (!titleText) {
        return null;
    }

    var hasCreate = titleText.indexOf('create') > -1 || titleText.indexOf('add') > -1 || titleText.indexOf('new') > -1;
    var hasEdit = titleText.indexOf('edit') > -1 || titleText.indexOf('update') > -1;

    if (hasCreate && hasEdit) {
        return null;
    }

    if (hasEdit) {
        return 'Update';
    }

    if (hasCreate) {
        return 'Save';
    }

    return null;
}

function syncModalSaveButtons(root) {
    var label = getModalSaveLabel(root);
    if (!label) return;

    var $root = $(root);
    var $saveButtons = $root.find('.gc-action-btn[data-gc-button-action="save"]');
    if (!$saveButtons.length) return;

    $saveButtons.each(function () {
        setActionButtonLabel($(this), label);
    });
}

function normalizeModalActionButtons(root) {
    resetBusyActionButtons(root);
    syncModalSaveButtons(root);
}

function ensureRowActionPrintButtons(root) {
    var scope = root && root.nodeType === 1 ? root : document;
    var menus = [];

    if (scope.matches && scope.matches('.row-actions .actions-menu')) {
        menus.push(scope);
    }

    if (scope.querySelectorAll) {
        scope.querySelectorAll('.row-actions .actions-menu').forEach(function (menu) {
            menus.push(menu);
        });
    }

    menus.forEach(function (menu) {
        if (!menu || menu.closest('[data-no-print="true"]') || menu.querySelector('.action-item.btn-print')) {
            return;
        }

        var printBtn = document.createElement('button');
        printBtn.type = 'button';
        printBtn.className = 'action-item btn-print';
        printBtn.setAttribute('data-permission', 'print');
        printBtn.innerHTML = '<span class="action-icon" aria-hidden="true">🖨</span>Print';
        menu.appendChild(printBtn);
    });

    if (typeof window.applyPermissionVisibility === 'function') {
        window.applyPermissionVisibility(scope);
    }
}

function escapePrintHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function printActionRow(button) {
    var btn = button && button.closest ? button.closest('.btn-print') : null;
    var row = btn ? btn.closest('tr') : null;
    if (!row) {
        window.print();
        return;
    }

    var table = row.closest('table');
    if (!table) {
        window.print();
        return;
    }

    var visibleCells = Array.prototype.filter.call(row.cells || [], function (cell) {
        return !!cell && cell.offsetParent !== null;
    });

    if (!visibleCells.length) {
        window.print();
        return;
    }

    var headers = [];
    var headerRow = table.tHead && table.tHead.rows && table.tHead.rows.length ? table.tHead.rows[0] : null;
    if (!headerRow) {
        headerRow = table.querySelector('tr');
    }

    if (headerRow && headerRow.cells) {
        headers = Array.prototype.map.call(headerRow.cells, function (cell) {
            return (cell.textContent || '').replace(/\s+/g, ' ').trim();
        });
    }

    var rowsHtml = '';
    visibleCells.forEach(function (cell, index) {
        var text = (cell.textContent || '').replace(/\s+/g, ' ').trim();
        var heading = headers[index] || ('Column ' + (index + 1));
        if (!text || heading.toLowerCase() === 'actions') {
            return;
        }

        rowsHtml += '<tr><th>' + escapePrintHtml(heading) + '</th><td>' + escapePrintHtml(text) + '</td></tr>';
    });

    if (!rowsHtml) {
        window.print();
        return;
    }

    var title = document.title || 'Row Print';
    var printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
        showToast('Unable to open print window.', 2500, { type: 'error', title: 'Print failed' });
        return;
    }

    printWindow.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + escapePrintHtml(title) + '</title>');
    printWindow.document.write('<style>body{font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#111;background:#fff}h2{margin:0 0 14px;font-size:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d1d5db;padding:10px;text-align:left;vertical-align:top}th{width:34%;background:#f3f4f6}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>' + escapePrintHtml(title) + '</h2>');
    printWindow.document.write('<table><tbody>' + rowsHtml + '</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

document.addEventListener('DOMContentLoaded', function () {
    var loginBtn = document.getElementById('loginBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var loginCloseBtn = document.getElementById('loginCloseBtn');
    var sendCodeBtn = document.getElementById('sendCodeBtn');
    var signInBtn = document.getElementById('signInBtn');
    var cancelLoginBtn = document.getElementById('cancelLoginBtn');
    var sidebarToggle = document.getElementById('sidebarToggle');
    var brandLink = document.querySelector('.top-nav .brand');

    clearClientStorageOnEntry();
    restoreAppState();
    initRichDatePickers(document);
    decorateActionButtons(document);
    ensureRowActionPrintButtons(document);

    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            openLogin();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', doLogout);
    }

    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', closeLogin);
    }

    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', sendCode);
    }

    if (signInBtn) {
        signInBtn.addEventListener('click', doSignIn);
    }

    if (cancelLoginBtn) {
        cancelLoginBtn.addEventListener('click', closeLogin);
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.body.classList.toggle('sidebar-collapsed');
            updateUserDetails({ sidebarCollapsed: document.body.classList.contains('sidebar-collapsed') });
            updateSidebarToggle();
        });
    }

    if (brandLink) {
        brandLink.addEventListener('click', function (e) {
            var details = getUserDetails() || {};
            var isLoggedIn = details.isLoggedIn === true;
            var isAdminMode = document.body.classList.contains('admin-mode');

            if (isLoggedIn && isAdminMode) {
                e.preventDefault();
                window.location.href = '/Admin/Dashboard';
            }
        });
    }
});

window.renderHeaderProfile = renderHeaderProfile;
window.getUserDetails = getUserDetails;
window.setUserDetails = setUserDetails;
window.updateUserDetails = updateUserDetails;

var gcDateObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node && node.nodeType === 1) {
                initRichDatePickers(node);
                decorateActionButtons(node);
            }
        }
    }
});

gcDateObserver.observe(document.documentElement, { childList: true, subtree: true });

var gcRowActionObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node && node.nodeType === 1) {
                ensureRowActionPrintButtons(node);
            }
        }
    }
});

gcRowActionObserver.observe(document.documentElement, { childList: true, subtree: true });

$(document).on('keyup', '.tbl-search', function () {
    var val = $(this).val();
    var tblId = $(this).data('table');
    if (typeof window.applyDataTableSearch === 'function') {
        window.applyDataTableSearch(tblId, val);
        return;
    }

    var lower = val.toLowerCase();
    $('#' + tblId + ' tbody tr').each(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(lower) > -1);
    });
});

$(document).on('click', '.js-print-page', function () {
    window.print();
});

$(document).on('click', '.action-item.btn-print', function (e) {
    e.preventDefault();
    printActionRow(this);
});

$(document).on('shown.bs.modal', '.modal', function () {
    normalizeModalActionButtons(this);
});

var gcModalBusyResetObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
        var target = mutations[i].target;
        if (!target || target.nodeType !== 1) {
            continue;
        }

        var $target = $(target);
        var isOverlayOpen = $target.hasClass('modal-overlay') && !$target.hasClass('hidden');
        var isBootstrapOpen = $target.hasClass('modal') && $target.hasClass('show');

        if (isOverlayOpen || isBootstrapOpen) {
            normalizeModalActionButtons(target);
        }
    }
});

gcModalBusyResetObserver.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
});
