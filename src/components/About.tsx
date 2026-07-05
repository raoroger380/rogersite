"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "AI写代码", value: "2年" },
  { label: "项目", value: "3" },
  { label: "技术栈", value: "0" },
];

export default function About() {
  return (
    <section id="about" className="relative z-10 section-spacing">
      <div className="section-container">
        <div className="section-header">
          <p className="overline">关于我</p>
          <h3>
            一个爱折腾的<span className="gradient-text">学生开发者</span>
          </h3>
          <p>
            我是一名 14 岁的学生，从小就开始对vibecoding感兴趣。
            从 Scratch 到C++，再到现在的 Web 开发，一路走来学到了很多。
            喜欢用代码实现自己的想法，也喜欢探索新技术。
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-44 h-44 md:w-52 md:h-52 rounded-2xl bg-[var(--accent-gradient)] flex items-center justify-center text-6xl shrink-0 shadow-lg shadow-purple-500/20"
          >
            👨‍💻
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-[var(--text-secondary)] max-w-md leading-loose space-y-5"
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

        <div className="flex justify-center gap-8 flex-wrap">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="glass-card text-center min-w-[120px]"
            >
              <div className="text-2xl font-bold gradient-text mb-2">{s.value}</div>
              <div className="text-sm text-[var(--text-tertiary)]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
