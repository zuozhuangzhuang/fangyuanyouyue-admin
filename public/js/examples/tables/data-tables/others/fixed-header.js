/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    var table = $('#exampleFixedHeader').DataTable($.po('dataTable', {
        pagingType: 'full_numbers',
        fixedHeader: {
            header: true,
            headerOffset: 0
        }
    }));

    if (Breakpoints.is('xs')) {
        table.fixedHeader.disable();
    }

    Breakpoints.on('xs', 'leave', function () {
        table.fixedHeader.enable();
    });

    Breakpoints.on('sm', 'leave', function () {
        table.fixedHeader.disable();
    });

})(window, document, jQuery);