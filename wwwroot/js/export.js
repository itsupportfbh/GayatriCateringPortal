(function () {
    function getTableById(tableId) {
        return tableId ? document.getElementById(tableId) : null;
    }

    function tableHtmlForExport(table) {
        if (!table) return '';
        return table.outerHTML;
    }

    function getDefaultExportName(table) {
        var page = document.body.getAttribute('data-page') || 'export';
        var title = document.title || page || 'export';
        return title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
    }

    function exportTableToExcel(tableId, fileName) {
        var table = getTableById(tableId);
        if (!table) {
            showToast('Table not found for export.', 2500, { type: 'error', title: 'Export failed' });
            return;
        }

        var html = '<html><head><meta charset="UTF-8"></head><body>' + tableHtmlForExport(table) + '</body></html>';
        var blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = (fileName || getDefaultExportName(table)) + '.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function exportTableToPdf(tableId, fileName) {
        var table = getTableById(tableId);
        if (!table) {
            showToast('Table not found for export.', 2500, { type: 'error', title: 'Export failed' });
            return;
        }

        var printWindow = window.open('', '_blank', 'width=1100,height=900');
        if (!printWindow) {
            showToast('Unable to open print window.', 2500, { type: 'error', title: 'Export failed' });
            return;
        }

        var title = fileName || getDefaultExportName(table);
        printWindow.document.write('<html><head><title>' + title + '</title>');
        printWindow.document.write('<style>body{font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#111;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} th{background:#f3f4f6;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>' + title + '</h2>');
        printWindow.document.write(table.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    function closeExportMenus() {
        document.querySelectorAll('.export-menu.open').forEach(function (menu) {
            menu.classList.remove('open');
            menu.classList.add('hidden');
        });
    }

    function buildExportMenu(tableId) {
        var excelIcon = '' +
            '<svg class="export-menu-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M6 3.5h7.1L18 8.4V20.5a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" fill="#1a6e3c" opacity=".14" />' +
            '<path d="M13.1 3.5V8.4H18" fill="none" stroke="#1a6e3c" stroke-width="1.5" stroke-linejoin="round" />' +
            '<path d="M6 3.5h7.1L18 8.4V20.5a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" fill="none" stroke="#1a6e3c" stroke-width="1.4" stroke-linejoin="round" />' +
            '<path d="M8 11.2h8M8 14.2h8M8 17.2h8" stroke="#1a6e3c" stroke-width="1.3" stroke-linecap="round" />' +
            '<path d="M9 10.1h2.1l.9 1.9.9-1.9H15l-1.8 2.8 1.9 3.1H13l-1-1.8-1 1.8H9l1.9-3.1-1.9-2.8Z" fill="#1a6e3c" />' +
            '</svg>';

        var pdfIcon = '' +
            '<svg class="export-menu-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M6 3.5h7.1L18 8.4V20.5a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" fill="#b91c1c" opacity=".12" />' +
            '<path d="M13.1 3.5V8.4H18" fill="none" stroke="#b91c1c" stroke-width="1.5" stroke-linejoin="round" />' +
            '<path d="M6 3.5h7.1L18 8.4V20.5a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2Z" fill="none" stroke="#b91c1c" stroke-width="1.4" stroke-linejoin="round" />' +
            '<path d="M8.2 16.9V9.9H11c1.7 0 2.8 1 2.8 2.6S12.7 15 11 15h-1v1.9H8.2Zm1.8-3.4h.7c.6 0 1-.4 1-1s-.4-1-1-1h-.7v2Zm3.6 3.4V9.9h2.4c2 0 3.2 1.1 3.2 3.2s-1.2 3.2-3.2 3.2h-2.4Zm1.6-1.4h.7c1 0 1.6-.6 1.6-1.8s-.6-1.8-1.6-1.8h-.7v3.6Zm4.5 1.4V9.9H20v1.3h-2.2v1.1h1.9v1.3h-1.9v2.6h-1.6Z" fill="#b91c1c" />' +
            '</svg>';

        var wrapper = document.createElement('div');
        wrapper.className = 'export-menu-wrap';
        wrapper.innerHTML = '' +
            '<button type="button" class="btn btn-light btn-export js-export-trigger" data-permission="download">' +
            '<span class="export-trigger-icon" aria-hidden="true">⭳</span>' +
            '<span class="export-trigger-label">Export</span>' +
            '</button>' +
            '<div class="export-menu hidden">' +
            '<div class="export-menu-header">' +
            '<div class="export-menu-title">Export data</div>' +
            '<div class="export-menu-subtitle">Choose the format that fits your workflow.</div>' +
            '</div>' +
            '<button type="button" class="export-menu-item js-export-excel" aria-label="Export as Excel">' +
            '<span class="export-menu-icon export-menu-icon-excel" aria-hidden="true">' + excelIcon + '</span>' +
            '<span class="export-menu-item-text">' +
            '<span class="export-menu-label">Excel</span>' +
            '<span class="export-menu-help">Spreadsheet format</span>' +
            '</span>' +
            '</button>' +
            '<button type="button" class="export-menu-item js-export-pdf" aria-label="Export as PDF">' +
            '<span class="export-menu-icon export-menu-icon-pdf" aria-hidden="true">' + pdfIcon + '</span>' +
            '<span class="export-menu-item-text">' +
            '<span class="export-menu-label">PDF</span>' +
            '<span class="export-menu-help">Print-ready document</span>' +
            '</span>' +
            '</button>' +
            '</div>';

        var toggle = wrapper.querySelector('.js-export-trigger');
        var menu = wrapper.querySelector('.export-menu');

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeExportMenus();
            menu.classList.toggle('hidden');
            menu.classList.toggle('open');
        });

        wrapper.querySelector('.js-export-excel').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            exportTableToExcel(tableId);
            closeExportMenus();
        });

        wrapper.querySelector('.js-export-pdf').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            exportTableToPdf(tableId);
            closeExportMenus();
        });

        return wrapper;
    }

    function injectExportMenus(root) {
        var scope = root || document;
        var actionBars = scope.querySelectorAll('.page-header-actions');

        actionBars.forEach(function (bar) {
            if (bar.querySelector('.export-menu-wrap')) return;

            var search = bar.querySelector('.tbl-search[data-table]');
            if (!search) return;

            var tableId = search.getAttribute('data-table') || '';
            if (!tableId) return;

            var addButton = bar.querySelector('.btn-add');
            var exportNode = buildExportMenu(tableId);
            if (addButton) {
                bar.insertBefore(exportNode, addButton);
            } else {
                bar.appendChild(exportNode);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectExportMenus(document);
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.export-menu-wrap')) {
            closeExportMenus();
        }
    });

    var exportObserver = new MutationObserver(function () {
        injectExportMenus(document);
    });

    exportObserver.observe(document.documentElement, { childList: true, subtree: true });

    window.exportTableToExcel = exportTableToExcel;
    window.exportTableToPdf = exportTableToPdf;
    window.injectExportMenus = injectExportMenus;
})();