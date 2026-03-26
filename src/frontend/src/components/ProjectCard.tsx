import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink,
  Heart,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend.d";
import {
  useAddComment,
  useComments,
  useHasLiked,
  useLikeCount,
  useToggleLike,
} from "../hooks/useQueries";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function CommentDialog({
  project,
  open,
  onClose,
}: { project: Project; open: boolean; onClose: () => void }) {
  const { data: comments = [], isLoading } = useComments(project.id, open);
  const addComment = useAddComment();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addComment.mutateAsync({
        projectId: project.id,
        authorName: name.trim(),
        content: content.trim(),
      });
      toast.success("Comment submitted! Awaiting approval.");
      setName("");
      setContent("");
    } catch {
      toast.error("Failed to submit comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="glass-strong border-border/40 max-w-lg max-h-[80vh] overflow-y-auto"
        data-ocid="project.comments.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {project.title} — Comments
          </DialogTitle>
        </DialogHeader>

        {/* Existing comments */}
        <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div
              className="text-center py-4"
              data-ocid="project.comments.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
            </div>
          ) : comments.length === 0 ? (
            <div
              className="text-center py-6"
              data-ocid="project.comments.empty_state"
            >
              <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first!
              </p>
            </div>
          ) : (
            comments.map((comment, idx) => (
              <div
                key={comment.id.toString()}
                className="glass rounded-lg p-3"
                data-ocid={`project.comment.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-primary">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(
                      Number(comment.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-t border-border/30 pt-4"
          data-ocid="project.comment.form"
        >
          <h4 className="text-sm font-semibold text-foreground/80">
            Leave a Comment
          </h4>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Your Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              data-ocid="project.comment.input"
              className="glass border-border/50 bg-transparent text-foreground text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Message</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Great work!"
              data-ocid="project.comment.textarea"
              className="glass border-border/50 bg-transparent text-foreground text-sm min-h-[80px]"
            />
          </div>
          <Button
            type="submit"
            disabled={addComment.isPending}
            data-ocid="project.comment.submit_button"
            className="btn-primary w-full gap-2"
          >
            {addComment.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            {addComment.isPending ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { data: likeCount = 0n } = useLikeCount(project.id);
  const { data: hasLiked = false } = useHasLiked(project.id);
  const toggleLike = useToggleLike();
  const { data: comments = [] } = useComments(project.id);
  const [commentOpen, setCommentOpen] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState<bigint | null>(null);
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);

  const currentLikes = optimisticLikes ?? likeCount;
  const currentLiked = optimisticLiked ?? hasLiked;

  const handleLike = async () => {
    const newLiked = !currentLiked;
    const newCount = newLiked ? currentLikes + 1n : currentLikes - 1n;
    setOptimisticLiked(newLiked);
    setOptimisticLikes(newCount < 0n ? 0n : newCount);
    try {
      const result = await toggleLike.mutateAsync(project.id);
      setOptimisticLikes(result);
    } catch {
      setOptimisticLiked(currentLiked);
      setOptimisticLikes(currentLikes);
      toast.error("Failed to update like");
    }
  };

  const delay = `${index * 0.1}s`;

  return (
    <>
      <article
        className="glass card-3d rounded-2xl overflow-hidden animate-fade-up cursor-pointer"
        style={{ animationDelay: delay }}
        data-ocid={`projects.item.${index + 1}`}
      >
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
            {project.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                className="text-xs bg-primary/30 text-primary border-primary/40 backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg font-bold mb-2 text-foreground line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags.length > 2 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.slice(2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-muted/50 text-muted-foreground border-border/40"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border/30">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                data-ocid={`projects.visit.button.${index + 1}`}
                className="btn-primary w-full gap-2 text-xs"
              >
                <ExternalLink className="w-3 h-3" /> Visit Website
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              disabled={toggleLike.isPending}
              data-ocid={`projects.like.button.${index + 1}`}
              className={`gap-1 text-xs transition-all ${
                currentLiked
                  ? "text-secondary hover:text-secondary/80"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${currentLiked ? "fill-current scale-110" : ""}`}
              />
              <span>{currentLikes.toString()}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCommentOpen(true)}
              data-ocid={`projects.comment.button.${index + 1}`}
              className="gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comments.length}</span>
            </Button>
          </div>
        </div>
      </article>

      <CommentDialog
        project={project}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      />
    </>
  );
}
