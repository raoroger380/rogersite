"use client";

export default function Signature() {
  return (
    <section id="signature" className="flex min-h-screen -translate-y-2 items-center justify-center py-10">
      <div className="section-container w-full">
        <div className="max-w-md mx-auto">
          <div className="glass-card text-center px-6 py-8 md:px-8 md:py-9">
            
            <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mt-1 mb-6">个性签名</h3>

            <div className="relative">
              {/* 左引号 */}
              <div className="absolute -top-3 -left-1 text-4xl leading-none opacity-15" style={{ color: "var(--accent)" }}>
                &ldquo;
              </div>

              {/* 签名内容 — 直接显示Base64 */}
              <p
                className="text-center text-lg md:text-xl font-bold leading-relaxed gradient-text break-all"
                style={{ fontStyle: "italic", wordBreak: "break-all" }}
              >
                5Y+L6LCK5piv5Y+M5ZCR55qE77yB
              </p>

              {/* 右引号 */}
              <div className="absolute -bottom-4 -right-1 text-4xl leading-none opacity-15" style={{ color: "var(--accent)" }}>
                &rdquo;
              </div>

              {/* 底部装饰线 */}
              <div className="mt-6 mx-auto w-12 h-[2px] rounded-full" style={{ background: "var(--accent-gradient)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
