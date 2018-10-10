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
        $modifyForm = $('#modifyDetailForm'),
        $editModal = $('#editModalForm'),
        $editForm = $('#editForm');
        
    function setChosen(data){
    		if(data==1){
    			return "<span class='label label-success'>是</span>"
    		}else if(data==2){
    			return "<span class='label label-default'>否</span>"
    		}else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };
    function setStatus(data){
    		if(data==1){
    			return "<span class='label label-success'>正常</span>"
    		}else if(data==2){
    			return "<span class='label label-danger'>已删除</span>"
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
                {
                		"data": "headImgUrl",
                		"render": setImg
                },
                {"data": "nickName"},
                {
                		"data": "columnName"
                },
                {"data": "title"},
                {"data": "totalCount"},
                {"data": "baseCount"},
                {"data": "realCount"},
                {
                		"data": "isChosen",
                		"render":setChosen
                },
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
                            
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default show" data-target="#detailForm" data-toggle="modal" data-original-title="详情">详情</button>';
						
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default modify" data-target="#modifyForm" data-toggle="modal" data-original-title="编辑">编辑</button>';
                        
                            if(data==1){
                                html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default delete" data-target="#editModalForm" data-toggle="modal" data-original-title="删除">删除</button>';
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
                    url: SERVER_PATH+'/forum/adminForum/forumList?'+param,
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
        		title: {
            title: {
                required: true
            },
            sort: {
                required: true
            }
        },
        messages: {
            title: {
                required: '请填写标题'
            },
            sort: {
                required: ''
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/forum/adminForum/updateForum',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.ajax.reload();
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



    //修改输入框内容
    var editForm = $editForm.validate({
        rules: {
            content: {
                required: true
            }
        },
        messages: {
            content: {
                required: '拒绝原因不能为空'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            
            $.ajax({
                url: SERVER_PATH + '/forum/adminForum/updateForum',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.code==0) {
		                toastr.success('操作成功！');
						oTable.ajax.reload();
                        $editModal.modal('hide');
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


    $editModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        editForm.resetForm();
    });
    
    
    function handleAction(){
    	
    		$("[data-toggle='tooltip']").tooltip();
	    
	    // 删除所选用户
	    $(document).on('click', '.delete', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$editForm.find('input[name="id"]').val(data.id);
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.show', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		var json = JSON.parse(data.content);
	    		var html = '';
	    		json.forEach(function(value,index,array){
	    			if(value.type==1){
					html += '<p>'+value.content+'</p>'		 
	    			}else if(value.type==2){
					html += '<img src="'+value.imgUrl+'" width=100%  />';
	    			}
		　　});
	    		
        		 $detailForm.find('.modal-title').html(data.title);
        		$detailForm.find('.modal-body').html(html);
	    		
	    });
	    
	    
	    // 编辑所选用户
	    $(document).on('click', '.modify', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$modifyForm.find('input[name="title"]').val(data.title);
        		
                $modifyForm.find('input[name="sort"]').val(data.sort);
                
        		$modifyForm.find('input[name="count"]').val(data.baseCount);
        		
        		$modifyForm.find("input[name='isChosen'][value="+data.isChosen+"]").attr("checked",true); 
        		
        		$modifyForm.find('input[name="id"]').val(data.id);
	    		
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
