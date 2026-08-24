"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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
    desc: "这是我个人网站的源代码，使用 Next.js 13、Tailwind CSS 和 Framer Motion 构建，展示了我的个人信息和项目。",
    tags: ["HTML5", "CSS3", "JavaScript", "Next.js 13", "Tailwind CSS", "Framer Motion"],
    href: "https://github.com/raoroger380",
  },
];

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <motion.a
      key={project.title}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-card overflow-hidden group cursor-pointer block project-card"
    >
      <div className="h-1 w-full bg-[var(--accent-gradient)]" />
      <div className={compact ? "project-card-body-mobile" : "project-card-body"}>
        <span className="project-card-arrow" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </span>
        <h4
          className={`font-bold text-[var(--text-primary)] min-w-0 ${
            compact ? "text-base mb-2" : "text-lg mb-4"
          }`}
        >
          {project.title}
        </h4>
        <p
          className={`text-[var(--text-secondary)] leading-relaxed ${
            compact ? "text-[13px] mb-4" : "text-sm mb-6"
          }`}
        >
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-tertiary)] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);

  const goTo = (next: number) => {
    setActive((next + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="project-section relative z-10">
      <div className="section-container w-full">
        <div className="section-header project-mobile-header">
          <p className="overline">我的项目</p>
          <h3>
            最近在做的<span className="gradient-text">东西</span>
          </h3>
          <p>这里放了我做的一些项目，虽然不多，但每个都用心做了。</p>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <ProjectCard key={active} project={projects[active]} compact />

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="project-nav-btn"
              aria-label="上一个项目"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`project-dot ${active === index ? "active" : ""}`}
                  aria-label={`查看第 ${index + 1} 个项目`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="project-nav-btn"
              aria-label="下一个项目"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
