"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const socials = [
  { name: "GitHub", username: "raoroger380", href: "https://github.com/raoroger380", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>` },
  { name: "抖音", username: "AirBus350100", href: "https://www.douyin.com/search/AirBus350100", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>` },
  { name: "微信", username: "18934300811", href: "tel:18934300811", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045.247.247 0 0 0 .242-.246c0-.06-.024-.12-.04-.178l-.325-1.233a.492.492 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.579c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/></svg>` },
  { name: "QQ", username: "3628942054", href: "https://wpa.qq.com/msgrd?v=3&uin=3628942054&site=qq&menu=yes", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C7.095 1 3 4.595 3 8.889c0 1.745.772 3.329 2.018 4.506-.58 1.986-1.587 3.162-2.498 3.878-.445.35-.164.829.285.812 1.835-.073 3.26-.612 4.296-1.26.814.332 1.725.528 2.684.64 0 0 .124 1.284.262 1.835.073.288.073.608-.248.865-.581.45-1.59.956-1.898 1.716-.242.608.288.946.683.946h4.822c.394 0 .925-.338.683-.946-.307-.76-1.317-1.265-1.898-1.716-.321-.257-.321-.577-.248-.865.138-.551.262-1.835.262-1.835.96-.112 1.87-.308 2.684-.64 1.036.648 2.461 1.187 4.296 1.26.45.017.73-.462.285-.812-.911-.716-1.918-1.892-2.498-3.878C20.228 12.218 21 10.634 21 8.89 21 4.595 16.905 1 12 1z"/></svg>` },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "raoroger380@gmail.com";
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="relative z-10 section-spacing">
      <div className="section-container">
        <div className="section-header">
          <p className="overline">找到我</p>
          <h3>
            一起<span className="gradient-text">交个朋友</span>吧
          </h3>
          <p>
            如果有想一起做的项目，或者单纯想聊聊天，都欢迎来找我！
          </p>
        </div>

        {/* 邮箱 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-14"
        >
          <button
            onClick={copyEmail}
            className="glass-card flex items-center gap-4 cursor-pointer hover:border-[var(--accent-purple)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent-cyan)]">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/>
            </svg>
            <span className="text-base font-medium text-[var(--text-primary)]">{email}</span>
            <span className={`text-sm transition-all ${copied ? "text-[var(--accent-cyan)]" : "text-[var(--text-tertiary)]"}`}>
              {copied ? "✓ 已复制" : "复制"}
            </span>
          </button>
        </motion.div>

        {/* 社交链接 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-purple)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.1)] transition-all duration-300 group"
              aria-label={s.name}
            >
              <span className="text-[var(--accent-purple)] opacity-70 group-hover:opacity-100 transition-opacity" dangerouslySetInnerHTML={{ __html: s.icon }} />
              <span className="text-sm font-medium hidden md:inline">{s.name}</span>
              <span className="text-sm text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]">@{s.username}</span>
            </a>
          ))}
        </motion.div>

        {/* 兴趣标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center flex-wrap gap-3 mt-16"
        >
          {["🎮 Minecraft", "🏸羽毛球", "🎵 听歌", "🖇 写代码", "📎 学习", "♠ 奶茶"].map((tag) => (
            <span
              key={tag}
              className="text-sm px-4 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent-purple)] hover:text-[var(--text-primary)] hover:bg-purple-50 transition-all duration-300 cursor-default"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
