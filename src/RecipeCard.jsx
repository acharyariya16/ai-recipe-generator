import { useState } from "react";

function parseRecipe(raw) {
  // Try to detect sections from markdown-style text
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines;
}

export default function RecipeCard({ recipe, ingredients }) {
  const [copied, setCopied] = useState(false);
  const lines = parseRecipe(recipe);

  const handleCopy = () => {
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect if a line is a section heading (##, bold, or ends with :)
  const isHeading = (line) =>
    /^#{1,3}\s/.test(line) ||
    /^\*\*.*\*\*$/.test(line) ||
    /^[A-Z][^a-z]{0,20}:$/.test(line);

  const isListItem = (line) => /^[-•*]\s/.test(line) || /^\d+\.\s/.test(line);

  const cleanLine = (line) =>
    line
      .replace(/^#{1,3}\s/, "")
      .replace(/^\*\*(.*)\*\*$/, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1");

  return (
    <div className="glass-card recipe-card">
      <div className="recipe-header">
        <div className="recipe-badge">
          <span>✦</span> Your Recipe
        </div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied!" : "⎘ Copy"}
        </button>
      </div>

      <div className="ingredient-pills">
        {ingredients
          .split(/[,\n]+/)
          .map((i) => i.trim())
          .filter(Boolean)
          .map((ing, idx) => (
            <span key={idx} className="pill">
              {ing}
            </span>
          ))}
      </div>

      <div className="recipe-body">
        {lines.map((line, idx) => {
          if (isHeading(line)) {
            return (
              <h3 key={idx} className="recipe-section-title">
                {cleanLine(line)}
              </h3>
            );
          }
          if (isListItem(line)) {
            return (
              <div key={idx} className="recipe-list-item">
                <span className="list-dot">◆</span>
                <span>{cleanLine(line.replace(/^[-•*\d.]\s*/, ""))}</span>
              </div>
            );
          }
          return (
            <p key={idx} className="recipe-para">
              {cleanLine(line)}
            </p>
          );
        })}
      </div>
    </div>
  );
}