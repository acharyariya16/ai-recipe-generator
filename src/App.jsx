import { useState, useRef } from "react";
import RecipeCard from "./RecipeCard";
import LoadingAnimation from "./LoadingAnimation";

export default function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const recipeRef = useRef(null);

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setError("Please enter at least one ingredient.");
      return;
    }

    setError("");
    setRecipe(null);
    setLoading(true);

    try {
      const res = await fetch(
        "https://rizzyriya.app.n8n.cloud/webhook/recipe-generator",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: ingredients.trim() }),
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const text =
        data?.recipe ||
        data?.output ||
        data?.text ||
        data?.message ||
        (typeof data === "string" ? data : JSON.stringify(data));

      setRecipe(text);
      setTimeout(() => recipeRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Network error — please check your connection and try again."
          : `Something went wrong: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="app-root">
      {/* Ambient background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo-badge">✦ AI Chef</div>
          <h1 className="headline">
            What's in your
            <span className="headline-accent"> kitchen?</span>
          </h1>
          <p className="subheadline">
            Drop your ingredients — our AI conjures a recipe worth cooking.
          </p>
        </header>

        {/* Input Card */}
        <div className="glass-card input-card">
          <label className="input-label">Your Ingredients</label>
          <textarea
            className={`ingredient-textarea ${shake ? "shake" : ""}`}
            placeholder="e.g. chicken, garlic, lemon, rosemary, olive oil…"
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          {error && (
            <div className="error-msg">
              <span>⚠</span> {error}
            </div>
          )}
          <button
            className={`generate-btn ${loading ? "loading" : ""}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" /> Generating…
              </>
            ) : (
              <>
                <span className="btn-icon">✦</span> Generate Recipe
              </>
            )}
          </button>
        </div>

        {/* Loading */}
        {loading && <LoadingAnimation />}

        {/* Recipe Output */}
        {recipe && !loading && (
          <div ref={recipeRef} className="recipe-reveal">
            <RecipeCard recipe={recipe} ingredients={ingredients} />
          </div>
        )}

        <footer className="footer">
          Crafted with ♥ · Powered by AI
        </footer>
      </div>
    </div>
  );
}