/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    "use strict";
    /* global moment */

    var oTable, searchData,
        $filterDate = $('#filter-date');
        
    function setStatus(data){
    		if(data==1){
    			return "<span class='label label-success'>正常</span>"
    		}else if(data==1){
    			return "<span class='label label-danger'>已冻结</span>"
    		}else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };

    var callback = function () {
        return $('.dataTable').DataTable($.po('dataTable', {
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            pagingType: "simple_numbers",
            columns: [
                {"data": "id"},
                {"data": "nickName"},
                {"data": "phone"},
                {
                		"data": "headImgUrl",
                		"render": setImg
                },
                {
                		"data": "gender",
                		"render": setGender
                },
//              {
//                  "data": "user",
//                  "render": function (data) {
//                      return data === null ? null : data.loginName;
//                  }
//              },
                {
                		"data": "status",
                		"render":setStatus
                },
                {"data": "addTime"}
            ],
            ajax: function (data, callback) {
                var param, column, dir,
                    userId = -1;

                if (data.order.length !== 0) {
                    column = data.order[0].column; // 列
                    dir = data.order[0].dir; // 排序（'asc'升 | 'desc'降）
                } else {
                    column = dir = '';
                }
                param = 'start=' + data.start + '&limit=' + data.length + '&column=' + column +
                    '&dir=' + dir;

                if (searchData) {
                    param += '&' + searchData;
                }

                if ($('#accountLog').length > 0) {
                    userId = $('#admui-signOut').data('user');
                    param += '&user.userId=' + userId;
                }

                $.ajax({
                    url: 'http://192.168.1.22:8880/admin/user/list?'+param,
                    method:'get',
                    cache: false,
                    //data: param,
                    //dataType: "JSON",
                    success: function (result) {
                        var tableData = null;
                        if (result.code==0) {
                            tableData = {
                                recordsTotal: result.total,
                                recordsFiltered: result.total,
                                data: result.data
                            };
                            callback(tableData);
                        } else {
                            toastr.error('出错了，请重试！');
                        }
                    },
                    error: function () {
                        toastr.error('服务器异常，请稍后再试！');
                    }
                });
            }
        }));
    };

    if (!$filterDate.length) {
        $('a[href="#log"]').on('shown.bs.tab', function () {
            if (!oTable) {
                oTable = callback();
            }
        });
    } else {
        oTable = callback();
        $filterDate.daterangepicker($.po('daterangepicker', {
            maxDate: new Date(),
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '最近7天': [moment().subtract(6, 'days'), moment()],
                '最近30天': [moment().subtract(29, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }));

        $(document).on('submit', '#logForm', function () {
            var date = $filterDate.val(),
                _index;

            if (date !== "") {
                _index = date.indexOf('至');
                $('input[name="startDate"]').val($.trim(date.substring(0, _index)) + " 00:00:00");
                $('input[name="endDate"]').val($.trim(date.substring(_index + 1)) + " 23:59:59");
            }

            searchData = $(this).serialize();
            oTable.ajax.reload();

            return false;
        });

        $(document).on('click', '.date-close', function () { // 删除选择时间
            $filterDate.val('');
            $('input[name="startDate"]').val('');
            $('input[name="endDate"]').val('');
        });
    }

})
(document, window, jQuery);
