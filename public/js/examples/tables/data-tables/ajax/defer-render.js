/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    "use strict";

    $('#dataTableExample').DataTable($.po('dataTable', {
        "ajax": $.ctx + "/public/data/examples/tables/dt-ajax.json",
        "deferRender": true
    }));

})(window, document, jQuery);

