"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const skillCategories = [
  {
    name: "前端",
    skills: [
      { name: "HTML / CSS", level: 85 },
      { name: "JavaScript", level: 75 },
      { name: "TypeScript", level: 60 },
      { name: "React", level: 55 },
      { name: "Next.js", level: 50 },
      { name: "Tailwind CSS", level: 70 },
    ],
  },
  {
    name: "后端 & 其他",
    skills: [
      { name: "Python", level: 70 },
      { name: "Node.js", level: 50 },
      { name: "Git", level: 65 },
      { name: "Linux", level: 45 },
    ],
  },
  {
    name: "兴趣爱好",
    skills: [
      { name: "Minecraft 红石", level: 80 },
      { name: "UI/UX 设计", level: 55 },
      { name: "算法", level: 40 },
    ],
  },
];

export default function Skills() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    // 延迟触发动画，确保组件挂载后执行
    const t = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="skills" className="relative z-10 section-spacing">
      <div className="section-container">
        <div className="section-header">
          <p className="overline">技能</p>
          <h3>
            我正<span className="gradient-text">学习</span>什么
          </h3>
          <p>
            学得越多，越觉得知道的太少。继续加油！
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex w-full max-w-5xl flex-col gap-5">
            {skillCategories.map((cat, ci) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
                className="glass-card grid gap-6 md:grid-cols-[150px_1fr] md:items-center"
              >
                <div className="md:border-r md:border-[var(--card-border)] md:pr-6">
                  <p className="mb-2 text-xs tracking-[0.18em] text-[var(--text-tertiary)]">技能分类</p>
                  <h4 className="text-xl font-bold text-[var(--text-primary)]">{cat.name}</h4>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="glass-card-item">
                      <div className="glass-card-item-label">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: animate ? `${s.level}%` : "0%",
                            transition: `width 0.8s ease ${ci * 0.1 + 0.2}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
