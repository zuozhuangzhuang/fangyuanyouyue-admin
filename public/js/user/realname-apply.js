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
    			return "<span class='label label-danger'>待审核</span>"
    		}else if(data==2){
    			return "<span class='label label-success'>审核通过</span>"
    		}else if(data==3){
    			return "<span class='label label-warning'>审核不通过</span>"
    		}else{
    			
    			return "<span class='label label-default'>状态有误</span>"
    		}
    };

    var callback = function () {
        return $('.dataTable').DataTable($.po('dataTable', {
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            order:[[0,"desc"]],
            pagingType: "simple_numbers",
            columns: [
                {"data": "id"},
                {"data": "phone"},
                {"data": "name"},
                {"data": "identity"},
                {
                		"data": "identityImgCover",
                		"render": setImg2
                },
                {
                		"data": "identityImgBack",
                		"render": setImg2
                },
                {"data": "rejectDesc"},
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
                {"data": "addTime"},
                {
                		"data": "status",
                		"render":function(data){
                			var html =  "";
                			if(data==1){
							html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default unfrozen" data-toggle="tooltip" data-original-title="审核通过">通过</button>';
                				html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default frozen" data-toggle="tooltip" data-original-title="审核不通过">拒绝</button>';
                			}
						return html;
                		}
                }
            ],
            ajax: function (data, callback) {
                var param, column, dir,
                    userId = -1;


                    if (data.order.length !== 0) {
                        column = data.order[0].column; // 列
                        column = data.columns[column].data;
                        dir = data.order[0].dir; // 排序（'asc'升 | 'desc'降）
                        if(dir=="asc"){
                            dir = 1;
                        }else{
                            dir = 2;
                        }
                    } else {
                        column = dir = '';
                    }
    
                    param = 'start=' + data.start + '&limit=' + data.length + '&orders=' + toLine(column) +
                    '&ascType=' + dir;

                if (searchData) {
                    param += '&' + searchData;
                }

                if ($('#accountLog').length > 0) {
                    userId = $('#admui-signOut').data('user');
                    param += '&user.userId=' + userId;
                }

                $.ajax({
                    url: SERVER_PATH+'/user/adminUser/auth/list?'+param,
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
            nickName: {
                required: true
            },
            phone: {
                required: true
            }
        },
        messages: {
            nickName: {
                required: '请填写URL地址'
            },
            phone: {
                required: '请填写URL对应名称'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/adminUser/modify',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.draw(false);
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
       // 不通过审核
	    $(document).on('click', '.frozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,3);
	    		
	    });
	    
	    // 通过审核
	    $(document).on('click', '.unfrozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,2);
	    		
	    });
    
	}
    
    //改变状态
    function changeStatus(id,status){
    		var msg = "确定通过审核吗？";
    		if(status==3){
    			msg = "确定不通过审核吗？";
    		}
	    parent.layer.confirm(msg, function (index) {
		    $.ajax({
		        url: SERVER_PATH + '/user/adminUser/auth/status',
		        type: 'POST',
		        data: {id: id,status:status},
		        traditional: true,
		        dataType: 'JSON',
		        success: function (data) {
		            if (data.code==0) {
		                toastr.success('操作成功！');
		                parent.layer.close(index);
						oTable.draw(false);
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
