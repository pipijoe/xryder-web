# X.Ryder

这是一个基于vite、react、tailwindcss和shadcn的中后台ui快速开发模板。

## 使用的组件
- 状态管理：zustand
- 路由使用：react-router-dom
- 样式ui使用 [tailwindcss](https://tailwindcss.com/docs/installation) + [shadcn/ui](https://ui.shadcn.com/)
- icon: [react-icons](https://react-icons.github.io/react-icons/)和[lucide](https://lucide.dev/icons/)
- 网络请求使用:axios
- 表单参数校验：zod 

## 运行
```shell
npm install

npm run dev
```

## 打包
```shell
npm run build
```

### Todo
- [x] 登录、token刷新、多次登录失败锁定
- [x] 深色模式
- [x] 国际化
- [x] 用户管理
- [x] 角色管理、权限校验
- [x] 部门管理
- [x] 操作日志
- [x] 登录日志
- [x] 账户管理、头像修改、密码重置等
- [x] 职位管理
- [x] 通知公告
- [ ] 用户信息页

## 参与开发
1. 创建一个本地分支
    ```git
      git checkout -b my-new-branch
    ```
2. 提交你的修改
    ```shell
    git commit -a -m 'Description of the changes'
    ```
3. 推送你的分支到远程仓库
    ```shell
    git push origin my-new-branch
    ```
4. 去到远程仓库发起合并请求