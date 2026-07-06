// ===== SHARED UTILITIES =====

function showToast(msg, duration) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, duration || 2500);
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

document.addEventListener('DOMContentLoaded', function () {
    var loginBtn = document.getElementById('loginBtn');
    var loginCloseBtn = document.getElementById('loginCloseBtn');
    var sendCodeBtn = document.getElementById('sendCodeBtn');
    var signInBtn = document.getElementById('signInBtn');
    var cancelLoginBtn = document.getElementById('cancelLoginBtn');
    var sidebarToggle = document.getElementById('sidebarToggle');

    restoreAppState();

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

document.addEventListener('click', function (e) {
    var overlay = document.getElementById('loginModal');
    if (overlay && e.target === overlay) closeLogin();
});

$(document).on('keyup', '.tbl-search', function () {
    var val = $(this).val().toLowerCase();
    var tblId = $(this).data('table');
    $('#' + tblId + ' tbody tr').each(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
    });
});

$(document).on('click', '.js-print-page', function () {
    window.print();
});
