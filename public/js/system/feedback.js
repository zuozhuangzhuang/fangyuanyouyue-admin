/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    "use strict";
    /* global moment */

    var oTable, searchData,
        $filterDate = $('#filter-date'),
        $detailModal = $('#detailForm'),
        $detailForm = $('#compileRoleForm');
        
    function setStatus(data){
    		if(data==1){
    			return "<span class='label label-success'>正常</span>"
    		}else if(data==2){
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
                {"data": "content"},
                {"data": "version"},
                {"data": "type"},
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
                    url: SERVER_PATH+'/user/adminUser/feedbackList?'+param,
                  //  url: SERVER_PATH+'/forum/adminForum/reportList?type=1&'+param,
                    method:'get',
                    cache: false,
                    //data: param,
                   // dataType: "jsoup",
                    success: function (result) {
                        var tableData = null;
                        if (result.code==0) {
                            tableData = {
                                recordsTotal: result.total,
                                recordsFiltered: result.total,
                                data: result.data
                            };
                            callback(tableData);
                            handleAction();
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
    
    //修改输入框内容
    var detailForm = $detailForm.validate({
        rules: {
            number: {
                required: true
            },
            name: {
                required: true
            }
        },
        messages: {
            number: {
                required: '请填写公司名称'
            },
            name: {
                required: '请填写物流编码'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/order/adminOrder/addCompany',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.ajax.reload();
                        $detailModal.modal('hide');
                    } else {
		                if(data.report){
		                    toastr.error(data.report);
		                }else{
		                     toastr.error('出错了，请重试！');
		                }
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        }
    });

    $detailModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        detailForm.resetForm();
    });


    
    function handleAction(){
    	
    		$("[data-toggle='tooltip']").tooltip();
       // 删除所选用户
	    $(document).on('click', '.frozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,2);
	    		
	    });
	    
	    // 删除所选用户
	    $(document).on('click', '.unfrozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,1);
	    		
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.modify', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$detailForm.find('input[name="number"]').val(data.companyNo);
        		
        		$detailForm.find('input[name="name"]').val(data.name);
        		
        		$detailForm.find('input[name="price"]').val(data.price);
        		
        		$detailForm.find('input[name="id"]').val(data.companyId);
	    		
	    });
    
	}
    
    //改变状态
    function changeStatus(id,status){
	    parent.layer.confirm("您确定要改变状态吗？", function (index) {
		    $.ajax({
		        url: SERVER_PATH + '/user/adminUser/delete',
		        type: 'POST',
		        data: {id: id,status:status},
		        traditional: true,
		        dataType: 'JSON',
		        success: function (data) {
		            if (data.code==0) {
		                toastr.success('操作成功！');
		                parent.layer.close(index);
						oTable.ajax.reload();
		                        //actionBtn.hide();
		            } else {
		                if(data.report){
		                    toastr.error(data.report);
		                }else{
		                     toastr.error('出错了，请重试！');
		                }
		                parent.layer.close(index);
		            }
		        },
		        error: function () {
		            toastr.error('服务器异常，请稍后再试！');
		        }
		   });
	   }, function () {
	        //actionBtn.hide();
	   });
    }
    
    
    //时间筛选
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
                searchData = $(this).serialize();
            }else{

                searchData = $(this).serialize().replace("startDate","").replace("endDate","");
            }

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
