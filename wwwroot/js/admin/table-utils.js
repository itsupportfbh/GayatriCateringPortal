function attachTableSort(tableId) {
    var table = document.getElementById(tableId);
    if (!table) return;

    var ths = table.querySelectorAll('th.sortable');
    ths.forEach(function (th) {
        th.addEventListener('click', function () {
            var columnIndex = Array.prototype.indexOf.call(th.parentNode.children, th);
            var currentOrder = th.classList.contains('sorted-asc') ? 'asc' : th.classList.contains('sorted-desc') ? 'desc' : null;
            var newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            ths.forEach(function (n) { n.classList.remove('sorted-asc', 'sorted-desc'); });
            th.classList.add(newOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
            sortTable(table, columnIndex, newOrder === 'asc');
        });
    });
}

function sortTable(table, colIndex, ascending) {
    var tbody = table.tBodies[0];
    if (!tbody) return;
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    rows.sort(function (a, b) {
        var aText = a.cells[colIndex].textContent.trim();
        var bText = b.cells[colIndex].textContent.trim();
        var aNum = parseFloat(aText.replace(/[^0-9.-]+/g, ''));
        var bNum = parseFloat(bText.replace(/[^0-9.-]+/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }

        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    rows.forEach(function (row) {
        tbody.appendChild(row);
    });
}

function attachTableSearch(searchId, tableId) {
    var searchInput = document.getElementById(searchId);
    var table = document.getElementById(tableId);
    if (!searchInput || !table) return;

    searchInput.addEventListener('keyup', function () {
        var query = searchInput.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(function (row) {
            var text = row.textContent.toLowerCase();
            row.style.display = text.indexOf(query) > -1 ? '' : 'none';
        });
    });
}

window.buildRowActions = function (id, opts) {
    opts = opts || {};
    var showEdit = opts.showEdit !== false;
    var showDelete = opts.showDelete !== false;
    var showToggle = opts.showToggle !== false;
    var showWA = !!opts.showWA;
    var showPermission = opts.showPermission !== false;
    var active = opts.active;
    var code = opts.code || '';
    var html = '<div class="row-actions">';
    html += '<button type="button" class="dots-btn" title="Actions">⋯</button>';
    html += '<div class="actions-menu hidden">';
    if (showEdit) html += '<button type="button" class="action-item btn-edit" data-id="' + id + '"><span class="action-icon p-p-pencil"></span>Edit</button>';
    if (showDelete) html += '<button type="button" class="action-item btn-delete" data-id="' + id + '"><span class="action-icon p-p-trash"></span>Delete</button>';
    if (showToggle) html += '<button type="button" class="action-item btn-toggle" data-id="' + id + '" data-state="' + (active ? 'active' : 'inactive') + '"><span class="action-icon p-p-' + (active ? 'lock' : 'unlock') + '"></span>' + (active ? 'Inactive' : 'Active') + '</button>';
    if (showPermission) html += '<button type="button" class="action-item btn-role-permission" data-id="' + id + '" data-code="' + code + '"><span class="action-icon p-p-cog"></span>Role Permission</button>';
    if (showWA) html += '<button type="button" class="action-item btn-wa" data-id="' + id + '"><span class="action-icon p-p-phone"></span>WA</button>';
    html += '</div></div>';
    return html;
};

function closeActionMenus() {
    document.querySelectorAll('.actions-menu').forEach(function (menu) {
        menu.classList.add('hidden');
        menu.style.position = '';
        menu.style.top = '';
        menu.style.left = '';
        menu.style.right = '';
    });
    document.querySelectorAll('.row-actions').forEach(function (row) {
        row.classList.remove('open');
    });
}

function initRowActionMenus() {
    document.addEventListener('click', function (event) {
        var btn = event.target.closest('.dots-btn');
        if (!btn) {
            if (!event.target.closest('.actions-menu')) {
                closeActionMenus();
            }
            return;
        }

        event.stopPropagation();
        var row = btn.closest('.row-actions');
        var menu = btn.nextElementSibling;
        if (!menu || !menu.classList.contains('actions-menu')) return;

        var isOpen = !menu.classList.contains('hidden');
        document.querySelectorAll('.actions-menu').forEach(function (otherMenu) {
            if (otherMenu !== menu) {
                otherMenu.classList.add('hidden');
                otherMenu.style.position = '';
                otherMenu.style.top = '';
                otherMenu.style.left = '';
                otherMenu.style.right = '';
            }
        });

        if (isOpen) {
            menu.classList.add('hidden');
            row.classList.remove('open');
            menu.style.position = '';
            menu.style.top = '';
            menu.style.left = '';
            menu.style.right = '';
            return;
        }

        row.classList.add('open');
        document.querySelectorAll('.row-actions').forEach(function (otherRow) {
            if (otherRow !== row) otherRow.classList.remove('open');
        });

        var rect = btn.getBoundingClientRect();
        var viewportWidth = window.innerWidth;
        var top = rect.bottom + 6;

        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.left = '-9999px';
        menu.style.right = 'auto';
        menu.style.maxWidth = 'calc(100vw - 24px)';
        menu.classList.remove('hidden');
        menu.style.visibility = 'hidden';

        var menuWidth = menu.offsetWidth;
        var menuHeight = menu.offsetHeight;

        if (top + menuHeight > window.innerHeight - 12) {
            top = rect.top - menuHeight - 6;
        }

        if (rect.left + menuWidth > viewportWidth - 12) {
            menu.style.left = 'auto';
            menu.style.right = '12px';
        } else {
            var left = rect.right - menuWidth;
            left = Math.max(12, Math.min(left, viewportWidth - menuWidth - 12));
            menu.style.left = left + 'px';
            menu.style.right = 'auto';
        }

        menu.style.top = top + 'px';
        menu.style.visibility = '';
    });
}

function initAdminTableUtils() {
    document.querySelectorAll('table.tbl').forEach(function (table) {
        var tableId = table.id;
        if (!tableId) return;
        if (table.querySelectorAll('th.sortable').length) {
            attachTableSort(tableId);
        }
    });

    document.querySelectorAll('input[data-table]').forEach(function (input) {
        attachTableSearch(input.id, input.dataset.table);
    });

    initRowActionMenus();
}

document.addEventListener('DOMContentLoaded', initAdminTableUtils);
