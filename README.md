# UCAS-Realtime-GPA
- 用于实时计算UCAS绩点的插件
- 假期没事，编一些代码，故写此插件

  之前了解过学长的相关脚本（<https://github.com/TimeSea05/gpa-calc-ucas>），但需要挂载到一个油猴插件上使用，但去年还是上半年发现无法使用，遂想自己写一个插件。
- 目前支持本科成绩计算（2024.7.29）
- 学习资料
  - https://learn.microsoft.com/zh-cn/microsoft-edge/extensions-chromium/getting-started/part1-simple-extension?tabs=v3
  - https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html
- 使用方法（以edge为例）
  - 下载目录 
  - 将目录通过开发者模式加载到edge浏览器插件处

    ![alt text](pics/pic.png)
  - 查询成绩时刷新即可
- 待更新内容
  - [ ] 不及格即重修GPA计算（如何显示？）
  - [ ] 次辅修成绩区分
  - [ ] 五级制“合格”与PF制“合格”的区分
  - [ ] 读取“合格”非法
  - [ ] 始终显示总GPA
