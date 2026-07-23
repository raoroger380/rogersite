"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Auto-Xuhuohua（自动续火花）",
    desc: "基于 AutoJs6 的抖音自动续火花脚本，每天自动给置顶好友发送消息维持火花。支持半自动和全自动模式，适配 iQOO 11S 等安卓设备。",
    tags: ["AutoJs6", "JavaScript", "Android", "自动化"],
    href: "https://github.com/raoroger380/Auto-Xuhuohua",
  },
  {
    title: "班级网站 - 澜石中学9班",
    desc: "为班级定制的官方网站，包含口令加密访问、相册集、视频播放、网盘下载、通讯录等功能，集中存储班级活动的珍贵回忆。",
    tags: ["HTML5", "CSS3", "JavaScript", "SHA-256"],
    href: "https://github.com/raoroger380/class809",
  },
  {
    title: "生日贺卡",
    desc: "精美的交互式生日贺卡，包含粒子文字变形、互动蛋糕场景、麦克风吹蜡烛检测、祝福卡片和焰火特效。",
    tags: ["Canvas API", "Web Audio", "JavaScript"],
    href: "https://github.com/raoroger380/nywsr724",
  },
  {
    title: "这本身就是一个项目",
    desc: "这是我个人网站的源代码，使用 Next.js 13、Tailwind CSS 和 Framer Motion 构建，展示了我的个人信息、项目和技能。",
    tags: ["等你来填"],
    href: "https://github.com/raoroger380",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 section-spacing">
      <div className="section-container">
        <div className="section-header">
          <p className="overline">我的项目</p>
          <h3>
            最近在做的<span className="gradient-text">东西</span>
          </h3>
          <p>
            这里放了我做的一些项目，虽然不多，但每个都用心做了。
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {projects.map((p, i) => (
              <motion.a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card overflow-hidden group cursor-pointer p-0 block"
                style={{ perspective: "1000px" }}
              >
                <div className="h-1 w-full bg-[var(--accent-gradient)]" />
                <div className="p-8">
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">{p.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-tertiary)] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
