/**
 * 自定义主页
 */

layui.define(function (exports) {
  // 区块轮播
  layui.use(['admin', 'carousel'], function () {
    var $ = layui.$,
      admin = layui.admin,
      carousel = layui.carousel,
      element = layui.element,
      device = layui.device()

    //轮播切换
    $('.layadmin-carousel').each(function () {
      var that = $(this)
      // 渲染轮播
      carousel.render({
        elem: that,
        width: '100%',
        arrow: 'none', // 不显示箭头
        interval: that.data('interval'),
        autoplay: that.data('autoplay') === true,
        trigger: device.ios || device.android ? 'click' : 'hover', // 指示器的触发事件
        anim: that.data('anim')
      })
      // 渲染进度条
      element.render('progress')
    })
  })

  //访问量
  layui.use(['carousel', 'echarts'], function () {
    var $ = layui.$,
      carousel = layui.carousel,
      echarts = layui.echarts

    var echartsApp = [],
      options = [
        {
          tooltip: {
            trigger: 'axis'
          },
          calculable: true,
          legend: {
            data: ['访问量', '下载量', '平均访问量']
          },

          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '访问量',
              axisLabel: {
                formatter: '{value} 万'
              }
            },
            {
              type: 'value',
              name: '下载量',
              axisLabel: {
                formatter: '{value} 万'
              }
            }
          ],
          series: [
            {
              name: '访问量',
              type: 'line',
              data: [900, 850, 950, 1000, 1100, 1050, 1000, 1150, 1250, 1370, 1250, 1100]
            },
            {
              name: '下载量',
              type: 'line',
              yAxisIndex: 1,
              data: [850, 850, 800, 950, 1000, 950, 950, 1150, 1100, 1240, 1000, 950]
            },
            {
              name: '平均访问量',
              type: 'line',
              data: [870, 850, 850, 950, 1050, 1000, 980, 1150, 1000, 1300, 1150, 1000]
            }
          ]
        }
      ],
      elemDataView = $('#carousel-index-item').children('div'),
      renderDataView = function (index) {
        echartsApp[index] = echarts.init(elemDataView[index], layui.echartsTheme)
        echartsApp[index].setOption(options[index])
        window.onresize = echartsApp[index].resize
      }
    //没找到DOM，终止执行
    if (!elemDataView[0]) return
    renderDataView(0)
  })

  exports('console', {})
})
