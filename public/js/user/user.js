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
        
        $vipModal = $('#vipModalForm'),
        $vipForm = $('#vipForm'),
        $balanceModal = $('#balanceModalForm'),
        $balanceForm = $('#balanceForm');
        
        
        
        
    function setStatus(data){
    		if(data==1){
    			return "<span class='label label-success'>正常</span>"
    		}else if(data==2){
                return "<span class='label label-danger'>已冻结</span>"
            }else if(data==3){
                return "<span class='label label-danger'>已删除</span>"
            }else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };
    
   
         
    function setAuthType(data){
        if(data==1){
            return "<span class='label label-warning'>认证中</span>"
        }else if(data==2){
            return "<span class='label label-success'>已认证</span>"
        }else if(data==3){
            return "<span class='label label-default'>未认证</span>"
        }else{
            return "<span class='label label-default'>未知</span>"
        }
    };
        
    function setCredit(data){
        if(data==1){
            return "<span class='label label-danger'>差</span>"
        }else if(data==2){
            return "<span class='label label-warning'>低</span>"
        }else if(data==3){
            return "<span class='label label-warning'>中</span>"
        }else if(data==4){
            return "<span class='label label-info'>高</span>"
        }else if(data==5){
            return "<span class='label label-success'>优</span>"
        }else{
            return "<span class='label label-default'>未知</span>"
        }
    };  
            
    function setVip(data){
    		if(data==1){
    			return "<span class='label label-success'>已开通</span>"
    		}else if(data==2){
    			return "<span class='label label-default'>未开通</span>"
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
            order:[[0,"desc"]],
            columns: [
                {"data": "id"},
                {
                		"data": "headImgUrl",
                        "render": setImg,
                        "ordering":false
                },
                {"data": "nickName"},
                {"data": "phone"},
                {
                		"data": "level"
                },
                {"data": "creditLevel","render":setCredit},
                {"data": "balance"},
                {"data": "point"},
                {"data": "authType","render":setAuthType},
                {
                		"data": "vipStatus",
                		"render": setVip
                },
                {"data": "fansBaseCount"},
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
                {"data": "addTime"},
                {
                		"data": "status",
                		"render":function(data){
                			var html =  "";
                			//if(data==2){
						//	html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default unfrozen" data-toggle="tooltip" data-original-title="解除冻结">解冻</button>';
                			//}else {
                			//	html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default frozen" data-toggle="tooltip" data-original-title="冻结">冻结</button>';
                			//}
                			
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modifyBalance" data-target="#balanceModalForm" data-toggle="modal" data-original-title="增减余额">余额</button>';

                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modifyVip" data-target="#vipModalForm" data-toggle="modal" data-original-title="改变会员状态">会员</button>';
                			
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modify" data-target="#detailForm" data-toggle="modal" data-original-title="编辑信息">编辑</button>';
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

                //param = 'start=' + data.start + '&limit=' + data.length + '&column=' + column +
                 //   '&dir=' + dir;

                if (searchData) {
                    param += '&' + searchData;
                }

                if ($('#accountLog').length > 0) {
                    userId = $('#admui-signOut').data('user');
                    param += '&user.userId=' + userId;
                }

                $.ajax({
                    url: SERVER_PATH+'/user/adminUser/list?'+param,
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
    
    var balanceForm = $balanceForm.validate({
        rules: {
            amount: {
                required: true
            }
        },
        messages: {
            amount: {
                required: '金额不能为空'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/wallet/adminWallet/updateUserBalance',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.draw(false);
                        $balanceModal.modal('hide');
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
    //修改输入框内容
    var vipForm = $vipForm.validate({
        rules: {
            type: {
                required: true
            }
        },
        messages: {
            type: {
                required: '类型不能为空'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/wallet/adminWallet/updateUserVip',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.draw(false);
                        $vipModal.modal('hide');
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
    //修改输入框内容
    var detailForm = $detailForm.validate({
        rules: {
            count: {
                required: true
            }
        },
        messages: {
            count: {
                required: '粉丝基数不能为空'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/user/adminUser/updateUser',
                type: 'PUT',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
                        toastr.success('操作成功！');
                        oTable.draw(false);
						//oTable.draw(false);
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

    $vipModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        vipForm.resetForm();
    });
    $balanceModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        balanceForm.resetForm();
    });

    
    function handleAction(){
    	
    		$("[data-toggle='tooltip']").tooltip();
	    $(document).on('click', '.frozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,2);
	    		
	    });
	    
	    $(document).on('click', '.unfrozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.id,1);
	    		
	    });
	    
	    $(document).on('click', '.modify', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$detailForm.find('input[name="nickName"]').val(data.nickName);
        		
        		$detailForm.find('input[name="phone"]').val(data.phone);
        		$detailForm.find('input[name="fansCount"]').val(data.fansBaseCount);
        		$detailForm.find('input[name="id"]').val(data.id);
	    		
        		$detailForm.find("input[name='status'][value="+data.status+"]").attr("checked",true); 
        		$detailForm.find("input[name='authType'][value="+data.authType+"]").attr("checked",true); 
	    });
    
	    
	    // 编辑所选用户
	    $(document).on('click', '.modifyVip', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$vipForm.find('input[name="id"]').val(data.id);
        		
	    		
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.modifyBalance', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$balanceForm.find('input[name="id"]').val(data.id);
        		
	    		
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
