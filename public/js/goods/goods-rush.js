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
    			return "<span class='label label-success'>出售中</span>"
    		}else if(data==2){
    			return "<span class='label label-danger'>已售出</span>"
    		}else if(data==3){
    			return "<span class='label label-danger'>已下架</span>"
    		}else if(data==5){
    			return "<span class='label label-default'>已删除</span>"
    		}else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };


    

    function setAppraisal(data){
    		if(data==1){
    			return "已鉴定"
    		}else if(data==2){
    			return "未鉴定"
    		}else{
    			return "未知"
    		}
    };
    
    

    function setType(data){
    		if(data==1){
    			return "已认证"
    		}else if(data==2){
    			return "未认证"
    		}else{
    			return "未知"
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
                {"data": "goodsId"},
                {
                		"data": "goodsImgDtos",
                		"render": setImgs
                },
                {"data": "name"},
                {"data": "description"},
                {"data": "price"},
                {"data": "postage"},
                {"data": "intervalTime","render":function(data){
                		return data/(60) + "分钟"
                }
                },
                {"data": "markdown"},
                {"data": "nickName"},
                {"data": "authType","render":setType},
                {"data": "isAppraisal","render":setAppraisal},
//              {
//                  "data": "user",
//                  "render": function (data) {
//                      return data === null ? null : data.loginName;
//                  }
//              },
                {"data": "sort"},
                {
                		"data": "status",
                		"render":setStatus
                },
                {"data": "addTime"},
                {
                		"data": "status",
                		"render":function(data){
                			var html =  "";
                		
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default delete" data-toggle="tooltip" data-original-title="删除商品">删除</button>';
                		
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modify" data-target="#detailForm" data-toggle="modal" data-original-title="编辑">编辑</button>';
						return html;
                		}
                }
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
                    url: SERVER_PATH+'/goods/adminGoods/goodsList?type=2&'+param,
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
            name: {
                required: true
            },
            description: {
                required: true
            }
        },
        messages: {
            name: {
                required: ''
            },
            description: {
                required: ''
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/goods/adminGoods/updateGoods',
                type: 'PUT',
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
	    
	    // 
	    $(document).on('click', '.apprais', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.goodsId,5);
	    		
	    });
	    
	    // 删
	    $(document).on('click', '.delete', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.goodsId,5);
	    		
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.modify', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$detailForm.find('input[name="name"]').val(data.name);
        		
        		$detailForm.find('input[name="description"]').val(data.description);
        		
        		$detailForm.find('input[name="sort"]').val(data.sort);
        		
        		$detailForm.find("input[name='isAppraisal'][value="+data.isAppraisal+"]").attr("checked",true); 
        		
        		//$detailForm.find('input[name="isAppraisal"]').val(data.isAppraisal);
        		
        		$detailForm.find('input[name="id"]').val(data.goodsId);
	    		
	    });
    
	}
    
    //改变状态
    function changeStatus(id,status){
	    parent.layer.confirm("您确定要删除商品吗？", function (index) {
		    $.ajax({
		        url: SERVER_PATH + '/goods/adminGoods/updateGoods',
		        type: 'PUT',
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
