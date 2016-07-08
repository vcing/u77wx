# U77 leancloud 微信站

## 通用规则
src 文件夹内为模板源码
模板按照模块分文件夹 一个文件夹为一个模块

###js处理
.entry.js 结尾为 js编译入口 最后在 desc/js 文件夹内生成对应的 .js 结尾打包文件
其他src内的 .js结尾文件为 依赖类 最终编译结果由 引用其的.entry.js 决定

###css 处理
scss 文件由gulp编译压缩 打包至/dest/css/style.min.css

###其他
其他资源文件按照src目录下原路径移至dest 文件夹下

开发时 需要开启 
`webpack -w`
`gulp`
`lean up`