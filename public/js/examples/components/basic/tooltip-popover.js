/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    $('[data-toggle="tooltip"]:not(#tooltipClick)').tooltip({trigger: 'hover'});
    $('#tooltipClick').tooltip({trigger: 'click'});
    $('[data-toggle="popover"]').popover();

    // Webui Popover - 表格
    // ------------------------------------
    var tableContent = $('#examplePopoverTable').html();

    $('#examplePopWithTable').webuiPopover($.po("webuiPopover", {
        title: 'WebUI Popover',
        content: tableContent,
        width: 500
    }));

    // Webui Popover - 列表组
    // -----------------------------------
    var listContent = $('#examplePopoverList').html();

    $('#examplePopWithList').webuiPopover($.po("webuiPopover", {
        content: listContent,
        title: '',
        padding: false
    }));

    // Webui Popover - 内容较多
    // --------------------------------------------
    var largeContent = $('#examplePopoverLargeContent').html();

    $('#examplePopWithLargeContent').webuiPopover($.po("webuiPopover", {
        title: 'WebUI Popover',
        content: largeContent,
        width: 400,
        height: 350,
        closeable: true
    }));

})(document, window, jQuery);