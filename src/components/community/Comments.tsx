import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { addComment } from "@/app/community/[id]/actions";

export interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  author_name: string;
}

export function Comments({
  projectId,
  comments,
  isLoggedIn,
}: {
  projectId: string;
  comments: CommentItem[];
  isLoggedIn: boolean;
}) {
  const addCommentWithId = addComment.bind(null, projectId);

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <MessageCircle className="h-4.5 w-4.5 text-brand-blue-500" />
        Comments ({comments.length})
      </h2>

      {isLoggedIn ? (
        <form action={addCommentWithId} className="mt-4 flex gap-3">
          <textarea
            name="body"
            required
            placeholder="Share a tip or ask a question…"
            rows={2}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue-400 focus:outline-none focus:ring-4 focus:ring-brand-blue-100"
          />
          <button
            type="submit"
            className="self-end rounded-full bg-brand-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-700"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-400">
          <a href="/login" className="font-semibold text-brand-blue-600 hover:underline">
            Log in
          </a>{" "}
          to join the conversation.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{comment.author_name}</p>
                <p className="text-xs text-slate-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-600">{comment.body}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No comments yet. Be the first!</p>
        )}
      </div>
    </Card>
  );
}
