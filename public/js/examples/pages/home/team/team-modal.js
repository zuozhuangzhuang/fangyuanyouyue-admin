/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    'use strict';

    window.teamModal = {
        selectiveInit: function (handleSelectiveItem) {
            var member = [{
                id: 'uid_1',
                name: '周伊娅',
                avatar: '/public/images/portraits/1.jpg'
            }, {
                id: 'uid_2',
                name: '程思思',
                avatar: '/public/images/portraits/2.jpg'
            }, {
                id: 'uid_3',
                name: '张倩',
                avatar: '/public/images/portraits/3.jpg'
            }, {
                id: 'uid_4',
                name: '蒋海燕',
                avatar: '/public/images/portraits/4.jpg'
            }];

            $('#people').selective({
                namespace: 'addMember',
                local: member,
                selected: handleSelectiveItem,
                buildFromHtml: false,
                tpl: {
                    optionValue: function (data) {
                        return data.id;
                    },
                    frame: function () {
                        return '<div class="' + this.namespace + '">' +
                            this.options.tpl.items.call(this) +
                            '<div class="' + this.namespace + '-trigger">' +
                            this.options.tpl.triggerButton.call(this) +
                            '<div class="' + this.namespace + '-trigger-dropdown">' +
                            this.options.tpl.list.call(this) +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    },
                    triggerButton: function () {
                        return '<div class="' + this.namespace + '-trigger-button"><i class="wb-plus"></i></div>';
                    },
                    listItem: function (data) {
                        return '<li class="' + this.namespace + '-list-item"><img class="avatar" src="' + data.avatar + '">' + data.name + '</li>';
                    },
                    item: function (data) {
                        return '<li class="' + this.namespace + '-item"><img class="avatar" src="' + data.avatar + '" title="' + data.name + '">' +
                            this.options.tpl.itemRemove.call(this) +
                            '</li>';
                    },
                    itemRemove: function () {
                        return '<span class="' + this.namespace + '-remove"><i class="wb-minus-circle"></i></span>';
                    },
                    option: function (data) {
                        return '<option value="' + this.options.tpl.optionValue.call(this, data) + '">' + data.name + '</option>';
                    }
                }
            });
        },
        draw: function () {
            var handleSelectiveItem = [{
                id: 'uid_1',
                name: '程思思',
                avatar: '/public/images/portraits/1.jpg'
            }, {
                id: 'uid_2',
                name: '蒋海燕',
                avatar: '/public/images/portraits/2.jpg'
            }];

            this.selectiveInit(handleSelectiveItem);
        },
        editDraw: function (title, date) {
            $("#editTitle").val(title);
            $("#editDueDate").val(date);
        },
        run: function () {
            this.draw();
        }
    };

    window.teamModal.run();

})(document, window, jQuery);