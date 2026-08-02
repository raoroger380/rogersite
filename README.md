# 个人网站 | Airbus350-1000

这是 [raoroger380/rogersite](https://github.com/raoroger380/rogersite) 的源码仓库，也是个人网站的本体。网站使用 Next.js 构建为纯静态站点，包含个人介绍、项目展示、技能进度、兴趣爱好、个性签名和联系方式。

## 技术栈

- Next.js 16
- React 19
- TypeScript 6
- Tailwind CSS 4
- Framer Motion
- 静态导出：`next.config.ts` 配置了 `output: "export"`

## 环境要求

- Node.js `>= 20.9.0`（本项目在 Node.js `v24.15.0` 下验证通过）
- npm（当前验证版本为 `11.17.0`）
- Git

当前仓库没有 `package-lock.json`，因此安装依赖请使用 `npm install`，不要直接使用 `npm ci`。

## 本地启动

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

启动后打开：

```text
http://localhost:3000
```

开发模式支持热更新，修改 `src/` 下的代码后页面会自动刷新。

### 3. 一键启动

Windows 下也可以直接双击 `start.bat`。

注意：`start.bat` 当前写死了本机路径：

```text
C:\Users\Administrator\Documents\个人网站
```

如果项目被复制到其他目录，需要先修改 `start.bat`，否则建议使用 `npm run dev`。

## 构建与预览

### 构建静态站点

```bash
npm run build
```

构建命令实际执行：

```text
next build --webpack
```

构建成功后，静态文件会输出到 `out/`。

### 本地预览生产产物

因为项目配置了 `output: "export"`，**不要使用 `npm run start`**。`next start` 不支持静态导出模式，会直接报错。

预览 `out/` 可以使用：

```bash
npx serve@latest out
```

然后打开终端提示的本地地址。

## 部署上线

### 方式一：Cloudflare Pages（推荐）

1. 把代码推送到 GitHub：

   ```bash
   git push origin master
   ```

2. 打开 Cloudflare Dashboard，进入 **Workers & Pages**。

3. 选择 **Create** -> **Pages** -> **Connect to Git**。

4. 选择 GitHub 仓库 `raoroger380/rogersite`，分支选择 `master`。

5. 构建配置建议如下：

   ```text
   Framework preset: 保持默认或选择 Next.js
   Build command:     npm run build
   Build output directory: out
   ```

6. 点击 **Save and Deploy**。

首次部署完成后会得到一个 `https://<project>.pages.dev` 地址。以后每次推送到 `master`，Cloudflare Pages 会自动重新构建并发布最新代码。

也可以使用 Wrangler CLI 手动部署：

```bash
npx wrangler login
npx wrangler pages deploy out --project-name=<你的 Pages 项目名>
```

### 方式二：GitHub Pages

本项目已经配置静态导出，因此也适合部署到 GitHub Pages。当前仓库还没有 `.github/workflows/`，需要自行添加 Actions workflow，流程是：

1. 安装 Node.js。
2. 执行 `npm install`。
3. 执行 `npm run build`。
4. 把 `out/` 上传为 GitHub Pages 产物并发布。

注意：`out/` 目前被 `.gitignore` 忽略，所以 GitHub Pages 必须通过构建流程生成，而不是直接提交 `out/`。

## 保持 GitHub 与本地一致

### 一键推送

Windows 下双击 `push.bat` 会依次执行：

```text
git add -A
git commit -m "Update"
git push origin master
```

如果工作区没有新改动，脚本会提示：

```text
No changes to commit. Working tree is clean.
```

这是正常行为，脚本不会创建空提交。

### 手动推送

```bash
git status
git add -A
git commit -m "更新"
git push origin master
```

提交前建议先运行 `npm run build`，确认没有构建错误。

### 哪些文件不会上传

以下内容被 `.gitignore` 忽略，不会上传到 GitHub：

- `node_modules/`
- `.next/`
- `out/`
- `temp-site/`
- `screenshot.png`
- `screenshot2.png`
- `next-env.d.ts`

因此 GitHub 上保存的是源码和配置，而不是构建缓存、依赖或本地截图。

## 目录结构

```text
个人网站/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ globals.css
│  │  └─ globals.css.bak
│  └─ components/
│     ├─ About.tsx
│     ├─ Contact.tsx
│     ├─ Footer.tsx
│     ├─ Hero.tsx
│     ├─ Hobbies.tsx
│     ├─ Navbar.tsx
│     ├─ ParticleBackground.tsx
│     ├─ Projects.tsx
│     ├─ ScrollProgress.tsx
│     ├─ SectionWrapper.tsx
│     ├─ Signature.tsx
│     └─ Skills.tsx
├─ public/
│  ├─ apple-icon.png
│  ├─ favicon.png
│  └─ site-icon.png
├─ .gitignore
├─ README.md
├─ _write_config.js
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ push.bat
├─ start.bat
├─ tsconfig.json
└─ 微信图片_20260720182819_121_79.jpg
```

## 文件作用

### 根目录文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | 项目信息、npm 脚本和依赖。`dev` 启动开发服务器，`build` 构建静态站点，`start` 当前配置下不可用 |
| `next.config.ts` | Next.js 配置。当前开启 `output: "export"` 和 `images.unoptimized` |
| `tsconfig.json` | TypeScript 编译配置 |
| `postcss.config.mjs` | Tailwind CSS 4 的 PostCSS 配置 |
| `.gitignore` | 忽略依赖、构建产物、截图等文件 |
| `README.md` | 项目说明、启动方式、文件职责和部署上线文档 |
| `start.bat` | Windows 一键启动开发服务器 |
| `push.bat` | Windows 一键提交并推送 GitHub，脚本为纯 ASCII，避免中文编码导致批处理解析失败 |
| `_write_config.js` | 旧配置生成脚本。会重写 `tsconfig.json` 和 `next.config.ts`，请勿随意运行，可能覆盖当前静态导出配置 |
| `微信图片_20260720182819_121_79.jpg` | 仓库中已跟踪的一张图片，当前源码没有引用；如果只是本地参考图，可以后续从 Git 中移除 |

### src/app

| 文件 | 作用 |
| --- | --- |
| `layout.tsx` | 根布局，配置页面标题、描述、字体和站点图标 |
| `page.tsx` | 首页入口，组合导航栏、首屏、关于、项目、技能、爱好、签名、联系和页脚 |
| `globals.css` | 全局样式、CSS 变量、卡片样式、按钮样式、进度条样式和深浅色主题变量 |
| `globals.css.bak` | `globals.css` 的旧备份，当前源码没有引用，可以删除 |

### src/components

| 文件 | 作用 |
| --- | --- |
| `Navbar.tsx` | 顶部导航、当前区块高亮、深浅色主题切换和移动端菜单 |
| `Hero.tsx` | 网站首屏，展示姓名、标语、介绍和快捷入口 |
| `About.tsx` | 关于我，包含个人介绍和统计卡片 |
| `Projects.tsx` | 项目卡片列表，展示项目描述、标签和 GitHub 链接 |
| `Skills.tsx` | 技能分类和技能进度条 |
| `Hobbies.tsx` | 兴趣爱好卡片 |
| `Signature.tsx` | 个性签名区域 |
| `Contact.tsx` | 邮箱复制、GitHub/抖音/微信/QQ 链接和兴趣标签 |
| `Footer.tsx` | 页脚，显示版权和作者信息 |
| `ParticleBackground.tsx` | 全屏 Canvas 粒子背景 |
| `ScrollProgress.tsx` | 页面顶部滚动进度条占位，目前宽度固定为 0%，尚未接入滚动更新逻辑 |
| `SectionWrapper.tsx` | 通用区块动画容器，当前页面没有使用 |

### public

| 文件 | 作用 |
| --- | --- |
| `site-icon.png` | 导航栏和页面 Logo，在 `Navbar.tsx` 中引用 |
| `favicon.png` | 浏览器标签页图标，在 `layout.tsx` 中引用 |
| `apple-icon.png` | Apple 设备图标，在 `layout.tsx` 中引用 |

### 生成或本地目录

| 目录 | 作用 |
| --- | --- |
| `node_modules/` | npm 安装的依赖目录，已被 Git 忽略 |
| `.next/` | Next.js 开发/构建缓存，已被 Git 忽略 |
| `out/` | `npm run build` 生成的静态站点，已被 Git 忽略，部署时使用此目录 |
| `temp-site/` | 旧的临时站点备份，未参与当前构建，已被 Git 忽略 |

## 修改网站内容

- 修改首页标题、标语、介绍：编辑 `src/components/Hero.tsx`。
- 修改个人介绍和统计：编辑 `src/components/About.tsx`。
- 修改项目列表：编辑 `src/components/Projects.tsx`。
- 修改技能列表：编辑 `src/components/Skills.tsx`。
- 修改联系方式：编辑 `src/components/Contact.tsx`。
- 修改导航和主题：编辑 `src/components/Navbar.tsx`。
- 修改页面标题和描述：编辑 `src/app/layout.tsx`。
- 修改整体颜色、卡片、按钮和背景：编辑 `src/app/globals.css`。

## 常见问题

### `push.bat` 提示 No changes to commit

正常现象。说明当前工作区没有新的被 Git 跟踪的改动，脚本不会生成空提交。如果你确实改过文件，请检查是否改在 `node_modules/`、`.next/`、`out/`、`temp-site/` 等被忽略的目录里。

### `npm run start` 报错

这是预期行为。项目使用静态导出 `output: "export"`，`next start` 不支持该模式。本地预览请使用：

```bash
npx serve@latest out
```

### 修改后页面没有变化

开发模式下请确认 `npm run dev` 正在运行；修改后刷新浏览器，或重新运行 `npm run build` 生成最新 `out/`。
