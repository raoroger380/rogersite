export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8">
      <div className="section-container flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-xs text-[var(--text-tertiary)]">&copy; {new Date().getFullYear()} 饶启烨</span>
        <span className="text-xs text-[var(--text-tertiary)]">使用Codex搭建基于Next.js</span>
      </div>
    </footer>
  );
}
