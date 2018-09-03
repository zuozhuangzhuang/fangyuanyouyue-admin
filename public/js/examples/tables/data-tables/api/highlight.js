/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    var lastIdx = null,
        table = $('#dataTableExample').DataTable($.po('dataTable'));

    $(document).on('mouseover', '#dataTableExample tbody td', function () {
        var colIdx = table.cell(this).index().column;
        if (colIdx !== lastIdx) {
            $(table.cells().nodes()).removeClass('highlight');
            $(table.column(colIdx).nodes()).addClass('highlight');
        }
    })
        .on('mouseleave', '#dataTableExample tbody', function () {
            $(table.cells().nodes()).removeClass('highlight');
        });

})(window, document, jQuery);

