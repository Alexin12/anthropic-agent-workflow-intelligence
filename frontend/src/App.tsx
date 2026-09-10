import { FormEvent, useEffect, useState } from "react";


type Source = {
  id: number;
  url: string;
  created_at: string;
};

type Health = {
  status: string;
  database: string;
};

export default function App() {
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [servicesConnected, setServicesConnected] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const [healthResponse, sourcesResponse] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/sources"),
      ]);
      const health: Health = await healthResponse.json();
      const savedSources: Source[] = await sourcesResponse.json();

      setServicesConnected(
        health.status === "ok" && health.database === "connected"
      );
      setSources(savedSources);
    }

    void loadDashboard();
  }, []);

  async function saveSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: sourceUrl }),
    });
    const savedSource: Source = await response.json();

    setSources((currentSources) => [savedSource, ...currentSources]);
    setSourceUrl("");
  }

  return (
    <main>
      <header>
        <p className="eyebrow">Local Anthropic Corpus</p>
        <h1>Workflow Intelligence</h1>
        <p className={servicesConnected ? "status connected" : "status"}>
          <span aria-hidden="true" />
          {servicesConnected ? "Services connected" : "Connecting services"}
        </p>
      </header>

      <section aria-labelledby="sources-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sources</p>
            <h2 id="sources-heading">Save a Source URL</h2>
          </div>
          <span className="count">{sources.length} saved</span>
        </div>

        <form onSubmit={saveSource}>
          <label htmlFor="source-url">Source URL</label>
          <div className="form-row">
            <input
              id="source-url"
              type="url"
              required
              placeholder="https://www.anthropic.com/research/..."
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
            <button type="submit">Save Source</button>
          </div>
        </form>

        {sources.length === 0 ? (
          <p className="empty">No Sources saved yet.</p>
        ) : (
          <ul>
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.url}
                </a>
                <time dateTime={source.created_at}>
                  {new Date(source.created_at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
