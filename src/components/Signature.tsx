"use client";

export default function Signature() {
  return (
    <section id="signature">
      <div className="section-container section-spacing">
        <div className="section-header">
          <p className="overline">Signature</p>
          <h3>个性签名</h3>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card text-center">
            <div className="relative py-12 px-8">
              {/* 左引号 */}
              <div className="absolute top-4 left-6 text-6xl leading-none opacity-10" style={{ color: "var(--accent-purple)" }}>
                &ldquo;
              </div>

              {/* 签名内容 */}
              <p
                className="text-2xl md:text-3xl font-bold leading-relaxed gradient-text"
                style={{ fontStyle: "italic" }}
              >
                友谊是双向的！
              </p>

              {/* 右引号 */}
              <div className="absolute bottom-4 right-6 text-6xl leading-none opacity-10" style={{ color: "var(--accent-cyan)" }}>
                &rdquo;
              </div>

              {/* 底部装饰线 */}
              <div className="mt-8 mx-auto w-16 h-[2px] rounded-full" style={{ background: "var(--accent-gradient)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
