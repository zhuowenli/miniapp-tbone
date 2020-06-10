# 更新日志

## 0.9.15

* 支持 document.documentElement.scrollTop

## 0.9.14

* 支持 window.$$getOpenerEventChannel

## 0.9.12

* 支持 document 的 visibilitychange 事件

## 0.9.9

* 自动构建 npm 逻辑支持检测 npm 包是否已被安装进而跳过此过程
* 构建时自动删除 acss 不支持的 ~ 选择器相关样式

## 0.9.8

* 支持获取第三方自定义组件的实例

## 0.9.5

* 支持跨页面通信
* 支持跨页面数据共享

## 0.9.4

* 在 generate.app 值为 noemit 且只有分包输出时，config.js 输出到分包内

## 0.9.3

* 页面跳转时传入的 targeturl 支持不带域名

## 0.9.2

* 修复分包导致的输出文件丢失问题

## 0.9.1

* 支持 XMLHttpRequest 对象

## 0.9.0

* 分享回调函数返回的 path 字段支持企业页面的 url（跨页面分享）

## 0.8.8

* 修复异常跳转进入分包页面时拼接路由错误的问题

## 0.8.5

* 因为小程序 acss 目前不支持 .xxx>:first-child 写法，将 css 后处理为 .xxx>*:first-child 写法

## 0.8.4

* 支持分享原始的小程序页面路径

## 0.8.2

* 修复没有传入 projectConfig 配置导致构建报错问题

## 0.8.1

* 支持调整 project.config.json 文件的输出目录

## 0.8.0

* 修复自动安装依赖会打印两次输出文件列表的问题

## 0.7.0

* 补充输出代码的全局变量

## 0.5.10

* 补充输出代码的全局变量

## 0.5.9

* 修复默认样式中 button 被追加 display: inline; 的问题

## 0.5.8

* 支持输出除 project.config.json 之外文件的配置

## 0.5.7

* 修复自动安装小程序依赖在 windows 下会报错的问题

## 0.5.6

* 自动安装小程序依赖时补充错误捕获

## 0.5.5

* 修复 generate.app 配置冲突问题

## 0.5.4

* 支持在构建完成后自动安装小程序依赖

## 0.5.3

* 将用户代码初始化调用后移到 window.location 初始化之后

## 0.5.1

* 支持 window.onload
* 支持 rem，需要基础库 2.9.0 以上
* 支持修改页面样式，需要基础库 2.9.0 以上

## 0.5.0

* 支持只输出页面相关代码（可用于独立分包）

## 0.4.4

* 支持自定义全局变量

## 0.4.3

* 将 miniapp-element/index.acss 中的 button 默认样式重制代码迁移到 app.acss 中

## 0.4.2

* 支持自定义 tabBar

## 0.4.1

* 删除生成的 acss 中不支持的 @-moz-keyframes 规则

## 0.4.0

* 支持自定义 app.js 和 app.acss
* 支持小程序自定义组件

## 0.2.2

* 支持 window 的 error 事件

## 0.1.3

* 修复不配置 tabBar 构建报错的问题

## 0.1.2

* 支持 tabBar

## 0.0.21

* 支持全局配置和页面配置中的 extra 字段，用于使用小程序的页面配置
* 全局配置和页面配置中的 backgroundColor 字段重命名为 pageBackgroundColor

## 0.0.20

* 支持分包

## 0.0.19

* 支持 runtime.wxComponent 配置

## 0.0.18

* 修复深拷贝生成 project.config.json 报错问题

## 0.0.17

* 修复通过浅拷贝生成 project.config.json 导致重复 push 内容的问题

## 0.0.16

* 支持监听小程序页面生命周期

## 0.0.15

* 支持 app.acss 的输出配置
