# 前端代码规范

## 规范来源

本项目的 HTML、CSS、JavaScript 代码主要参考以下主流规范：

- Google HTML/CSS Style Guide  
  https://google.github.io/styleguide/htmlcssguide.html
- Google JavaScript Style Guide  
  https://google.github.io/styleguide/jsguide.html
- Airbnb JavaScript Style Guide  
  https://github.com/airbnb/javascript

## 基本约定

1. HTML 标签和属性使用小写。
2. 使用 4 个空格缩进。
3. CSS 类名使用小写字母和中划线，例如 `history-panel`。
4. JavaScript 变量和函数使用小驼峰命名，例如 `expressionInput`。
5. 字符串统一使用双引号。
6. 每个函数只做一件事。
7. 按钮事件使用 `addEventListener`，避免在 HTML 中写 `onclick`。
8. 前端不负责核心计算，计算统一调用后端 API。
