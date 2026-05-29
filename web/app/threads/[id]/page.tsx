import { notFound } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/server";
import { deleteThreadAction } from "@/lib/actions";
import ChatConsole from "@/components/ChatConsole";

export const dynamic = "force-dynamic";

type StoredMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: unknown[];
  tool_name?: string;
};

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = store().getThread(id);
  if (!thread) notFound();

  const messages = thread.messages as StoredMessage[];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{thread.title}</h1>
          <div className="text-sm text-neutral-500 mt-1">
            <Link href={`/agents/${thread.agentId}`} className="hover:text-neutral-300">{thread.agentName}</Link>
            <span className="mx-2">·</span>
            <span>started {new Date(thread.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <form action={deleteThreadAction.bind(null, thread.id)}>
          <button className="text-xs text-neutral-500 hover:text-red-400">delete thread</button>
        </form>
      </div>

      <ChatConsole agentId={thread.agentId} threadId={thread.id} initialMessages={messages} />
    </div>
  );
}
