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
        $detailForm = $('#compileRoleForm'),
        $modifyModal = $('#modifyForm'),
        $modifyForm = $('#modifyDetailForm');
        
    function setStatus(data){
    		if(data==1){
    			return "<span class='label label-danger'>申请中</span>"
    		}else if(data==2){
    			return "<span class='label label-success'>成功</span>"
    		}else if(data==3){
    			return "<span class='label label-default'>失败</span>"
    		}else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };
    function setStatus2(data){
        if(data==1){
            return "待支付"
        }else if(data==2){
            return "待发货"
        }else if(data==3){
            return "待收货"
        }else if(data==4){
            return "已完成"
        }else if(data==5){
            return "已取消"
        }else{
            return "未知"
        }
};

    function setReturnStatus(data){
    		if(data==1){
    			return "处理中"
    		}else if(data==2){
    			return "同意"
    		}else if(data==3){
    			return "拒绝"
    		}else if(data==4){
    			return "默认同意"
    		}else if(data==5){
    			return "默认拒绝"
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
            order:[[0,"desc"]],
            pagingType: "simple_numbers",
            columns: [
                {"data": "id"},
               // {"data": "serviceNo"},
                //{"data": "orderNo"},
                //{"data": "reason"},
                {"data": "orderInfo.buyer"},
                {"data": "orderInfo.orderDetail"},
                {
                		"data": "sellerReturnStatus",
                		"render": setReturnStatus
                },
                {"data": "dealTime"},
                {"data": "refuseReason"},
                {"data": "endTime"},
                {"data": "platformReason"},
                {
                		"data": "status",
                		"render":setStatus
                },
                {"data": "addTime"},
                {
                		"data": "status",
                		"render":function(data){
                            var html =  "";
                            html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default show" data-target="#detailForm" data-toggle="modal" data-original-title="编辑">详情</button>';
						
                            if(data==1){
                                html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default unfrozen" data-toggle="tooltip" data-original-title="同意退货">同意</button>';
                                html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modify" data-target="#modifyForm" data-toggle="modal" data-original-title="编辑">拒绝</button>';
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
                    url: SERVER_PATH+'/order/adminOrder/refundList?'+param,
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
    var modifyForm = $modifyForm.validate({
        rules: {
            reason: {
                required: true
            }
        },
        messages: {
            reason: {
                required: '请填写理由'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/order/adminOrder/platformDealReturns',
                type: 'PUT',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.draw(false);
                        $modifyModal.modal('hide');
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

    $modifyModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        modifyForm.resetForm();
    });


    
    function handleAction(){
    	
    		$("[data-toggle='tooltip']").tooltip();
       // 删除所选用户
	    $(document).on('click', '.unfrozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,2);
	    		
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.show', function () {
            var index = oTable.row($(this).parent()).index(); //获取当前行的序列
            
            var data = oTable.rows().data()[index]; //获取当前行数据
            
            var json = JSON.parse(data.reason);
            var html = '';
            json.forEach(function(value,index,array){
                if(value.type==1){
                html += '<p>'+value.content+'</p>'		 
                }else if(value.type==2){
                html += '<img src="'+value.imgUrl+'" width=100%  />';
                }
        　　});
                
            $detailForm.find('#exampleTabsZero').html(html);


                
            $.ajax({
                url: SERVER_PATH + '/order/adminOrder/orderDetail',
                type: 'GET',
                data: {id:data.orderId},
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
                        //基本信息
                        data = data.data;
                        $detailForm.find('input[name="orderNo"]').val(data.orderNo);
                        $detailForm.find('input[name="addTime"]').val(data.addTime);
                        $detailForm.find('input[name="seller"]').val(data.seller);
                        $detailForm.find('input[name="status"]').val(setStatus2(data.status));
                        $detailForm.find('input[name="nickName"]').val(data.nickName);
                        
                        //订单详情
                        $detailForm.find('input[name="totalCount"]').val(data.totalCount);
                        $detailForm.find('textarea[name="orderDetail"]').html(data.orderDetail);
                        
                        //支付信息
                        $detailForm.find('input[name="payType"]').val(data.orderPayDto.payType);
                        $detailForm.find('input[name="totalAmount"]').val(data.orderPayDto.amount);
                        $detailForm.find('input[name="postage"]').val(data.orderPayDto.freight);
                        $detailForm.find('input[name="payAmount"]').val(data.orderPayDto.payAmount);
                        $detailForm.find('input[name="payTime"]').val(data.orderPayDto.payTime);
                        
                        //物流信息
                        $detailForm.find('textarea[name="receiver"]').html(data.orderPayDto.receiver);
                        $detailForm.find('input[name="logisticCompany"]').val(data.orderPayDto.logisticCompany);
                        $detailForm.find('input[name="logisticCode"]').val(data.orderPayDto.logisticCode);

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

                
        });
    
    // 编辑所选用户
        $(document).on('click', '.modify', function () {
            var index = oTable.row($(this).parent()).index(); //获取当前行的序列
                
            var data = oTable.rows().data()[index]; //获取当前行数据
                
            $modifyForm.find('input[name="orderId"]').val(data.id);
            $modifyForm.find('input[name="status"]').val(3);
            
        });
    
    };
    //改变状态
    function changeStatus(id,status){
	    parent.layer.confirm("您确定要同意吗？", function (index) {
		    $.ajax({
		        url: SERVER_PATH + '/order/adminOrder/platformDealReturns',
		        type: 'PUT',
		        data: {orderId: id,status:status},
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
