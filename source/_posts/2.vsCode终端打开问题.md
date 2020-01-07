---
title: 二、vsCode终端打开问题 
date: 2019-12-09
tags:
  - vscode
---

之前打开vscode时，报 终端进程命令"/bin/bash -l"无法启动 (退出代码: 1)；

![](/images/one.png)

<!-- more -->

其他报错也可以参考一下：


##  有以下几个解决思路

1.重装vscode；（我是这个方法解决的）

2.因为 VSCode 工作区的文件夹有变更（删除、移动等），导致 VSCode 打开终端时，找不到此文件夹而报错；

3.配置下 git 路径不对，重新配置一下git；在设置里修改 "terminal.integrated.shell.windows": "git路径base.exe"；

4.用管理员的权限来执行vscode，要不然它没有权限使用cmd;右击快捷键点击属性然后选择以管理员的身份运行

5. [github解决思路](https://github.com/Microsoft/vscode/issues/17450)