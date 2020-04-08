layui.define(['form', 'laydate', 'table'], function (exports) {
  var $ = layui.$,
    admin = layui.admin,
    view = layui.view,
    form = layui.form,
    laydate = layui.laydate,
    table = layui.table

  form.verify({
    username: function (value, item) {
      if (value === '') {
        return '用户名不能为空'
      }
      if (!new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$').test(value)) {
        return '用户名不能有特殊字符'
      }
    },
  })

  // 当前容器的实例
  var tableIns = table.render({
    elem: '#myTable',
    cellMinWidth: 80,
    url: './json/table/demo.json',
    page: true,
    cols: [
      [
        // 表头
        { type: 'checkbox', fixed: 'left' },
        { type: 'numbers', title: '序号' },
        { field: 'id', title: 'ID', width: 80, sort: true, align: 'center' },
        { field: 'username', title: '用户名', width: 80, align: 'center' },
        {
          field: 'sex',
          title: '性别',
          width: 80,
          align: 'center',
          templet: '#sexTpl',
        },
        { field: 'telphone', title: '手机号', width: 150, align: 'center' },
        { field: 'role', title: '角色', width: 120, align: 'center', templet: '#roleTpl' },
        { field: 'email', title: '邮箱', width: 150, align: 'center' },
        { field: 'city', title: '城市', width: 100, align: 'center' },
        { field: 'sign', title: '签名', width: 180, align: 'center' },
        { field: 'joinTime', title: '加入时间', width: 120, sort: true, align: 'center' },
        { title: '操作', width: 220, align: 'center', toolbar: '#myToolbar' },
      ],
    ],
  })

  // 监听行内工具条  注：tool 是工具条事件名，lay-filter-myTable是 table 原始容器的属性 lay-filter="对应的值"
  table.on('tool(lay-filter-myTable)', function (obj) {
    var data = obj.data //获得当前行数据
    var layEvent = obj.event //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
    var tr = obj.tr //获得当前行 tr 的 DOM 对象（如果有的话）

    if (layEvent === 'detail') {
      //查看
      data.type = 'view'
      admin.popup({
        title: '查看',
        area: ['500px', '600px'],
        id: 'lay-popup-table-view',
        success: function (layero, index) {
          // 渲染模板视图，并将数据传入。
          view(this.id)
            .render('myTable/editForm', data)
            .done(function () {
              laydate.render({
                elem: '#joinTime',
                showBottom: false,
                trigger: 'click',
              })
              // 渲染文件中的表单
              form.render(null, 'edit-form')
              $('#saveSubmit').hide()
            })
        },
      })
    } else if (layEvent === 'del') {
      layer.confirm('确认删除吗？', function (index) {
        obj.del() //删除对应行（tr）的DOM结构，并更新缓存
        layer.close(index)
        //向服务端发送删除指令
      })
    } else if (layEvent === 'edit') {
      data.type = 'edit'
      // 打开模态框
      admin.popup({
        title: '编辑',
        area: ['500px', '600px'],
        id: 'lay-popup-table-edit',
        success: function (layero, index) {
          // 渲染模板视图，并将数据传入。
          view(this.id)
            .render('myTable/editForm', data)
            .done(function () {
              laydate.render({
                elem: '#joinTime',
                showBottom: false,
                trigger: 'click',
              })
              // 渲染文件中的表单
              form.render(null, 'edit-form')
              //监听提交
              form.on('submit(save-submit)', function (data) {
                // 表单对象
                var formData = data.field

                // 防止重复点击
                var isDisabled = $('#saveSubmit').hasClass('layui-btn-disabled')
                if (isDisabled) {
                  return false
                }

                // 整合表单数据，如不用可忽略
                // $.extend(formData, { updateTime: $('#hiddenId').val() })

                //提交 Ajax 成功后，关闭当前弹层并重载表格
                $.ajax({
                  url: '',
                  type: 'post',
                  dataType: 'json',
                  data: formData,
                  beforeSend: function () {
                    $('#saveSubmit').addClass('layui-btn-disabled')
                  },
                  complete: function () {
                    $('#saveSubmit').removeClass('layui-btn-disabled')
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.code === 0) {
                      // 重载表格
                      layui.table.reload('myTable')
                      layer.close(index) //执行关闭
                    } else {
                      layer.alert(res.msg, { title: '提示信息', icon: 5 })
                    }
                  },
                })
                return false
              })
            })
        },
      })
    }
  })

  exports('myTable', {})
})
