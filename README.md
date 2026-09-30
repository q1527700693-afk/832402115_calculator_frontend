# 计算器前端

## 项目介绍

前后端分离计算器的 Web 前端，负责用户输入、调用后端接口、显示计算结果和历史记录。

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript
- Fetch API

## 运行方式

直接用浏览器打开 `index.html`，或使用 VS Code 的 Live Server 插件。

也可以使用 Python 启动静态服务器：

```bash
python -m http.server 5500
```

然后访问：

```text
http://localhost:5500
```

## 后端接口

前端默认请求：

```text
http://localhost:8080
```

接口：

```text
POST   /api/calculate
GET    /api/history
DELETE /api/history/{id}
```

## 目录结构

```text
frontend/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   └── calculator.js
├── README.md
└── codestyle.md
```

## 说明

核心计算全部由后端完成，前端只负责发送表达式和展示结果。


## 历史记录

- 查询历史：GET /api/history
- 删除单条：DELETE /api/history/{id}
- 清空全部：DELETE /api/history


## 模式

- 标准计算：四则运算、括号、历史记录
- 进制转换：2/8/10/16 进制互转
- 科学计算：三角函数、开方、幂、对数、π、e
