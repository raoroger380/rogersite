"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "年龄", value: "15" },
  { label: "项目", value: "4" },
  { label: "访问城市", value: "17" },
];

const recent = [
  { label: "最近在写", value: "班级网站" },
  { label: "最近在玩", value: "VEX 机器人" },
  { label: "最近在做", value: "生日贺卡" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 flex min-h-full w-full items-center justify-center px-4 py-4 md:py-8"
    >
      <div className="section-container w-full max-w-5xl">
        <div className="section-header mb-8 md:mb-14">
          <p className="overline">关于我</p>
          <h3>
            一个爱自由的<span className="gradient-text">学生</span>
          </h3>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8 md:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-32 w-32 shrink-0 rounded-2xl bg-[var(--accent-gradient)] text-5xl shadow-[var(--accent-shadow)] flex items-center justify-center md:h-52 md:w-52 md:text-6xl"
          >
            👨‍💻
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed md:space-y-5 md:text-base md:leading-loose"
          >
            <p>
              大家好！我是饶启烨，一名热爱编程的初中生。我在 2024 年开始接触编程，
              从最初的 C++ 开发到现在的 Web 开发，编程已经成为我生活中不可或缺的一部分。
            </p>
            <p>
              除了写代码，我还喜欢打羽毛球、听音乐和打三角洲。我相信技术可以改变世界，
              而我希望能用自己学到的知识做出一些有意义的东西。
            </p>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-2 md:gap-8">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass-card text-center min-w-[100px] md:min-w-[120px]"
              style={{ padding: "14px 12px" }}
            >
              <div className="text-2xl font-bold gradient-text mb-2">{s.value}</div>
              <div className="text-sm text-[var(--text-tertiary)]">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="recent-row" aria-label="最近动态">
          {recent.map((item) => (
            <span key={item.label} className="recent-chip">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
