import Link from "next/link";
import { store } from "@/lib/server";
import { deleteAgentAction } from "@/lib/actions";
import ConfirmingForm from "@/components/ConfirmingForm";
import { listOllamaModels } from "@/lib/ollama";

export const dynamic = "force-dynamic";

export default async function AgentsListPage() {
  const agents = store().listAgents();

  // First-run state. Catch the most common new-user blocker (Ollama not
  // running) and surface it here so they don't bounce off "No agents yet".
  if (agents.length === 0) {
    const ollama = await listOllamaModels();
    return <WelcomeScreen ollamaOk={ollama.ok} ollamaError={ollama.ok ? null : ollama.error} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Agents</h1>
        <Link href="/agents/new" className="px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded text-sm hover:bg-white">
          + new agent
        </Link>
      </div>

      <ul className="divide-y divide-neutral-800 border border-neutral-800 rounded">
        {agents.map((a) => (
          <li key={a.id} className="px-4 py-3 flex items-center justify-between">
            <Link href={`/agents/${a.id}`} className="hover:text-neutral-100 text-neutral-300">
              <div className="font-semibold">{a.name}</div>
              <div className="text-xs text-neutral-500">{a.model}</div>
            </Link>
            <ConfirmingForm
              action={deleteAgentAction.bind(null, a.id)}
              message={`Delete agent "${a.name}"? This cannot be undone.`}
            >
              <button className="text-xs text-neutral-500 hover:text-red-400">delete</button>
            </ConfirmingForm>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WelcomeScreen({ ollamaOk, ollamaError }: { ollamaOk: boolean; ollamaError: string | null }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Welcome to agentkit</h1>
      <p className="text-neutral-400 mb-8">
        Local-first agents that run on your machine, against your own Ollama models, with full control over which tools they can use.
      </p>

      <ol className="space-y-6">
        <Step
          n={1}
          title="Install and start Ollama"
          done={ollamaOk}
          body={
            ollamaOk ? (
              <p className="text-emerald-400 text-sm">Reached Ollama on localhost. Ready to go.</p>
            ) : (
              <div className="text-sm text-neutral-400 space-y-2">
                <p>
                  agentkit needs Ollama running locally to host the models that drive agents.
                  Download from{" "}
                  <a
                    href="https://ollama.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    ollama.com/download
                  </a>
                  {" "}and install. Once installed it runs in the background and listens on{" "}
                  <code className="text-neutral-300 bg-neutral-900 px-1 rounded">localhost:11434</code>.
                </p>
                <p className="text-xs text-neutral-500">
                  Status: not reachable {ollamaError ? `(${ollamaError})` : ""}. Refresh this page after starting Ollama.
                </p>
              </div>
            )
          }
        />
        <Step
          n={2}
          title="Pull a model"
          done={false}
          body={
            <div className="text-sm text-neutral-400 space-y-2">
              <p>
                In a terminal, pull a tool-calling-capable model. Good starting points:
              </p>
              <pre className="bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-neutral-300 overflow-x-auto">
{`ollama pull llama3.2:3b    # ~2 GB, lightweight, good for 8 GB machines
ollama pull qwen3:8b        # ~5 GB, more reliable tool calling
ollama pull qwen3:14b       # ~9 GB, best quality if your RAM allows`}
              </pre>
            </div>
          }
        />
        <Step
          n={3}
          title="Create your first agent"
          done={false}
          body={
            <div className="text-sm text-neutral-400 space-y-2">
              <p>Pick a name, choose a model, write a system prompt, and check the built-in tools you want the agent to use.</p>
              <Link
                href="/agents/new"
                className="inline-block px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded text-sm font-semibold hover:bg-white"
              >
                + new agent
              </Link>
            </div>
          }
        />
      </ol>
    </div>
  );
}

function Step({ n, title, done, body }: { n: number; title: string; done: boolean; body: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div
        className={`shrink-0 w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
          done ? "bg-emerald-700 text-white" : "bg-neutral-800 text-neutral-300"
        }`}
      >
        {done ? "✓" : n}
      </div>
      <div className="flex-1">
        <h2 className="font-semibold text-neutral-100 mb-1.5">{title}</h2>
        {body}
      </div>
    </li>
  );
}
