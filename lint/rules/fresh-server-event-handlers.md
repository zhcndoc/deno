---
tags: [fresh]
---

不允许在 fresh 服务器组件中使用事件处理程序。

在 fresh 应用中的 `routes/` 文件夹内的组件仅在服务器上渲染。
它们不会在客户端渲染，设置事件处理程序将没有效果。

请注意，这条规则仅适用于 `routes/` 文件夹内的服务器组件，而不适用于 fresh 岛屿或任何其他组件。

**无效：**

```jsx
<button onClick={() => {}} />
<button onclick={() => {}} />
<my-custom-element foo={() => {}} />
```

**有效：**

```jsx
<button />
<my-custom-element />
```