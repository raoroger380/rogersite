"use client";

import { motion } from "framer-motion";

const hobbies = [
  {
    name: "VEX 机器人",
    desc: "参加 VEX 机器人竞赛，自己动手搭建机器人、编写自动程序，在赛场上和队友一起协作竞技。",
    details: ["机械结构设计", "自动程序编程", "团队协作竞技"],
    color: "from-red-500 to-orange-500",
    emoji: "\u{1F916}",
  },
  {
    name: "航空",
    desc: "热爱航空知识，关注飞行器、民航和航空航天技术，梦想有一天能飞上蓝天。",
    details: ["飞行器知识", "民航航空", "航空航天技术"],
    color: "from-sky-500 to-indigo-500",
    emoji: "\u{2708}\u{FE0F}",
  },
];

export default function Hobbies() {
  return (
    <section id="hobbies" className="relative z-10 section-spacing">
      <div className="section-container">
        <div className="section-header">
          <p className="overline">爱好</p>
          <h3>
            课余时间在玩<span className="gradient-text">什么</span>
          </h3>
          <p>
            写代码之外，我还有两个超喜欢的爱好，每天都想花时间在上面的那种！
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {hobbies.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card overflow-hidden"
              >
                {/* 顶部色条 */}
                <div className={`h-2 w-full bg-gradient-to-r ${h.color}`} />

                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl mt-8 mb-4">{h.emoji}</span>
                  <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3">{h.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mx-8 mb-6">
                    {h.desc}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {h.details.map((d) => (
                      <span
                        key={d}
                        className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-tertiary)] font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
