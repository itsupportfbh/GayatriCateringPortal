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
    setTimeout(function () {
        var el = document.getElementById('loginEmail');
        if (el) el.focus();
    }, 100);
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('open');
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
    if (localStorage.getItem('gcLoggedIn') === 'true') {
        document.body.classList.add('logged-in');
        document.getElementById('loginBtn').textContent = 'Logout';
        var storedEmail = localStorage.getItem('gcUserEmail');
        var storedRole = localStorage.getItem('gcUserRole');
        if (storedEmail && storedRole) {
            document.getElementById('nav-status').textContent = '\uD83D\uDFE2 ' + storedRole + ': ' + storedEmail;
        }
    }
    if (localStorage.getItem('gcSidebarCollapsed') === 'true') {
        document.body.classList.add('sidebar-collapsed');
    }
    updateSidebarToggle();
}

function sendCode() {
    document.getElementById('loginCode').value = '123456';
    showToast('Demo code sent: 123456');
}

function doSignIn() {
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    var code = document.getElementById('loginCode').value.trim();
    var role = document.getElementById('loginRole').value;
    var roleLabels = {
        admin: 'Super Admin',
        kitchen: 'Kitchen Admin',
        driver: 'Driver',
        customer: 'Customer'
    };

    if (!email) {
        showToast('Please enter email');
        return;
    }

    if (password !== 'password123' && code !== '123456') {
        showToast('Invalid password or code. Use password123 or 123456');
        return;
    }

    document.body.classList.add('logged-in');
    localStorage.setItem('gcLoggedIn', 'true');
    localStorage.setItem('gcUserEmail', email);
    localStorage.setItem('gcUserRole', roleLabels[role] || 'User');
    document.getElementById('nav-status').textContent = '\uD83D\uDFE2 ' + (roleLabels[role] || 'User') + ': ' + email;
    document.getElementById('loginBtn').textContent = 'Logout';
    updateSidebarToggle();
    closeLogin();
    showToast('Signed in as ' + roleLabels[role]);

    if (role === 'admin' || role === 'kitchen' || role === 'driver') {
        window.location.href = '/Admin/Dashboard';
    }
}

function doLogout() {
    document.body.classList.remove('logged-in');
    document.body.classList.remove('sidebar-collapsed');
    localStorage.removeItem('gcLoggedIn');
    localStorage.removeItem('gcSidebarCollapsed');
    localStorage.removeItem('gcUserEmail');
    localStorage.removeItem('gcUserRole');
    document.getElementById('nav-status').textContent = '\uD83D\uDFE2 Guest';
    document.getElementById('loginBtn').textContent = 'Login';
    updateSidebarToggle();
    showToast('Logged out');
    window.location.href = '/Customer/Home';
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

document.addEventListener('DOMContentLoaded', function () {
    var loginBtn = document.getElementById('loginBtn');
    var loginCloseBtn = document.getElementById('loginCloseBtn');
    var sendCodeBtn = document.getElementById('sendCodeBtn');
    var signInBtn = document.getElementById('signInBtn');
    var cancelLoginBtn = document.getElementById('cancelLoginBtn');
    var sidebarToggle = document.getElementById('sidebarToggle');

    restoreAppState();
    initRichDatePickers(document);
    decorateActionButtons(document);

    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            if (loginBtn.textContent.trim() === 'Logout') {
                doLogout();
                return;
            }
            openLogin();
        });
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
            localStorage.setItem('gcSidebarCollapsed', document.body.classList.contains('sidebar-collapsed') ? 'true' : 'false');
            updateSidebarToggle();
        });
    }
});

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

document.addEventListener('click', function (e) {
    var overlay = document.getElementById('loginModal');
    if (overlay && e.target === overlay) closeLogin();
});

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
