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
}

document.addEventListener('DOMContentLoaded', initAdminTableUtils);
