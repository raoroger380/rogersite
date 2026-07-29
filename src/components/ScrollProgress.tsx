export default function ScrollProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
      <div
        className="h-full bg-[var(--accent-gradient)] transition-all duration-150"
        style={{ width: "0%" }}
      />
    </div>
  );
}
