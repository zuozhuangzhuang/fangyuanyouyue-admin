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
    			return "<span class='label label-success'>展示</span>"
    		}else if(data==2){
    			return "<span class='label label-danger'>不展示</span>"
    		}else{
    			return "<span class='label label-default'>未知</span>"
    		}
    };

    function setType(data){
        if(data==1){
            return "首页"
        }else if(data==2){
            return "商品详情"
        }else if(data==3){
            return "积分商品"
        }else{
            return "未知"
        }
    }

    function setJumpType(data){
        if(data==1){
            return "应用页面"
        }else if(data==2){
            return "链接URL"
        }else if(data==3){
            return "不跳转"
        }else{
            return "未知"
        }
    }


    function setBusinessType(data){
        if(data==1){
            return "商品详情"
        }else if(data==2){
            return "抢购详情"
        }else if(data==3){
            return "帖子详情"
        }else if(data==4){
            return "全民鉴定"
        }else if(data==5){
            return "视频详情"
        }else if(data==6){
            return "专栏"
        }else if(data==7){
            return "积分商城"
        }else{
            return "无"
        }
    }


    var callback = function () {
        return $('.dataTable').DataTable($.po('dataTable', {
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            order:[[0,"desc"]],
            pagingType: "simple_numbers",
            columns: [
                {"data": "bannerId"},
                {
                	"data": "imgUrl",
                	"render": setImg2
                },
                {"data": "title"},
                {"data": "type","render":setType},
                {"data": "jumpType","render":setJumpType},
                {"data": "businessType","render":setBusinessType},
                {"data": "businessId"},
                {"data": "sort"},
                {
                		"data": "status",
                		"render":setStatus
                },
                {
                		"data": "status",
                		"render":function(data){
                			var html =  "";
                			
                			html += '<button type="button" class="btn btn-sm btn-icon btn-flat btn-default unfrozen" data-toggle="tooltip" data-original-title="删除">删除</button>';
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


                    if(data.order[0].column==0 ){
                        column = "id";
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
                    url: SERVER_PATH+'/goods/adminGoods/bannerList?'+param,
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
            title: {
                required: true
            }
        },
        messages: {
            title: {
                required: '请填写标题'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);

            if($detailForm.find('input[name="imgFile"]')[0].files.length==0){
                $.ajax({
                    url: SERVER_PATH + '/goods/adminGoods/addBanner',
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
                    }
                });
                return;
            }

            var formData = new FormData();
            formData.append("imgFile", $detailForm.find('input[name="imgFile"]')[0].files[0]);  
            $.ajax({
                url: SERVER_PATH + '/user/file/uploadPic',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.code==0) {
                        //上传完图片再上传
                        $detailForm.find('input[name="imgUrl"]').val(data.data);
                        $.ajax({
                            url: SERVER_PATH + '/goods/adminGoods/addBanner',
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
                            }
                        });

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

        $detailForm.find('input[name="id"]').val('');
        $detailForm.find('input[name="title"]').val('');
        $detailForm.find('input[name="imgUrl"]').val('');
        $detailForm.find('input[name="businessId"]').val('');
        $detailForm.find('input[name="sort"]').val('');
        $detailForm.find("select[name='type']").val('');
        $detailForm.find("select[name='jumpType']").val('');
        $detailForm.find("select[name='businessType']").val('');

    });
    
    function handleAction(){
    	
    		$("[data-toggle='tooltip']").tooltip();
      
	    
	    // 删除所选用户
	    $(document).on('click', '.unfrozen', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
	    		changeStatus(data.bannerId,1);
	    		
	    });
	    
	    // 编辑所选用户
	    $(document).on('click', '.modify', function () {
	    		var index = oTable.row($(this).parent()).index(); //获取当前行的序列
	    		
	    		var data = oTable.rows().data()[index]; //获取当前行数据
	    		
        		$detailForm.find('input[name="id"]').val(data.bannerId);
        		$detailForm.find('input[name="title"]').val(data.title);
        		$detailForm.find("input[name='status'][value="+data.status+"]").attr("checked",true); 
                $detailForm.find('input[name="imgUrl"]').val(data.imgUrl);
                $detailForm.find('input[name="businessId"]').val(data.businessId);
                $detailForm.find('input[name="sort"]').val(data.sort);

                $detailForm.find("select[name='type']").val(data.type);
                $detailForm.find("select[name='jumpType']").val(data.jumpType);
                $detailForm.find("select[name='businessType']").val(data.businessType);
                
	    		
	    });
    
	}
    
    //改变状态
    function changeStatus(id,status){
	    parent.layer.confirm("您确定要删除吗？", function (index) {
		    $.ajax({
		        url: SERVER_PATH + '/goods/adminGoods/deleteBanner',
		        type: 'POST',
		        data: {bannerId:id,status:status},
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
