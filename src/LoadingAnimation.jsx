export default function LoadingAnimation() {
  const steps = [
    { icon: "🥄", label: "Reading ingredients" },
    { icon: "🔥", label: "Firing up the AI kitchen" },
    { icon: "🍳", label: "Crafting your recipe" },
    { icon: "✨", label: "Adding finishing touches" },
  ];

  return (
    <div className="loading-container glass-card">
      <div className="loading-orb-wrapper">
        <div className="loading-orb">
          <span className="orb-icon">👨‍🍳</span>
        </div>
        <div className="orb-ring ring-1" />
        <div className="orb-ring ring-2" />
        <div className="orb-ring ring-3" />
      </div>
      <p className="loading-title">AI Chef is cooking…</p>
      <div className="loading-steps">
        {steps.map((s, i) => (
          <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.4}s` }}>
            <span className="step-icon">{s.icon}</span>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}