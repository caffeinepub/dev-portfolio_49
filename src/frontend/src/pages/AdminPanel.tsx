import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  BarChart3,
  Check,
  Edit2,
  Eye,
  Heart,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllComments,
  useApproveComment,
  useContactMessages,
  useCreateProject,
  useDeleteComment,
  useDeleteProject,
  useInitAdmin,
  useIsAdmin,
  useLikeCount,
  useProjects,
  useUpdateProject,
  useVisitorStats,
} from "../hooks/useQueries";

interface AdminPanelProps {
  onExit: () => void;
}

function ProjectLikes({ projectId }: { projectId: bigint }) {
  const { data: count } = useLikeCount(projectId);
  return <span>{count?.toString() ?? "0"}</span>;
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project;
  onSave: (data: {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    url: project?.url ?? "",
    imageUrl: project?.imageUrl ?? "",
    tags: project?.tags?.join(", ") ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) {
      toast.error("Title and URL are required");
      return;
    }
    onSave({
      title: form.title,
      description: form.description,
      url: form.url,
      imageUrl: form.imageUrl,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground/80">Project Title *</Label>
          <Input
            data-ocid="admin.project.input"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="My Awesome Project"
            className="glass border-border/50 bg-transparent text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">Website URL *</Label>
          <Input
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            placeholder="https://example.com"
            className="glass border-border/50 bg-transparent text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">Image URL</Label>
          <Input
            value={form.imageUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, imageUrl: e.target.value }))
            }
            placeholder="https://example.com/image.png"
            className="glass border-border/50 bg-transparent text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80">Tags (comma separated)</Label>
          <Input
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
            placeholder="React, TypeScript, Web3"
            className="glass border-border/50 bg-transparent text-foreground"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-foreground/80">Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Describe your project..."
          className="glass border-border/50 bg-transparent text-foreground min-h-[100px]"
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="submit"
          data-ocid="admin.project.save_button"
          className="btn-primary"
        >
          {project ? "Update Project" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          data-ocid="admin.project.cancel_button"
          className="text-foreground/70 hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AdminPanel({ onExit }: AdminPanelProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: projects = [] } = useProjects();
  const { data: allComments = [] } = useAllComments();
  const { data: contactMessages = [] } = useContactMessages();
  const { data: stats } = useVisitorStats();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const approveComment = useApproveComment();
  const deleteComment = useDeleteComment();
  const initAdmin = useInitAdmin();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [adminSecret, setAdminSecret] = useState("");

  const handleCreateProject = async (data: {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    tags: string[];
  }) => {
    try {
      await createProject.mutateAsync(data);
      toast.success("Project created!");
      setShowAddForm(false);
    } catch {
      toast.error("Failed to create project");
    }
  };

  const handleUpdateProject = async (data: {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    tags: string[];
  }) => {
    if (!editingProject) return;
    try {
      await updateProject.mutateAsync({ id: editingProject.id, ...data });
      toast.success("Project updated!");
      setEditingProject(null);
    } catch {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: bigint) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleApproveComment = async (id: bigint) => {
    try {
      await approveComment.mutateAsync(id);
      toast.success("Comment approved");
    } catch {
      toast.error("Failed to approve comment");
    }
  };

  const handleDeleteComment = async (id: bigint) => {
    try {
      await deleteComment.mutateAsync(id);
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleInitAdmin = async () => {
    if (!adminSecret) return;
    try {
      await initAdmin.mutateAsync(adminSecret);
      toast.success("Admin access initialized! Please refresh.");
      setAdminSecret("");
    } catch {
      toast.error("Failed to initialize admin");
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-strong border-b border-border/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              data-ocid="admin.back_button"
              className="text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
            </Button>
            <Separator orientation="vertical" className="h-6 bg-border/50" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-semibold">
                Admin Panel
              </span>
            </div>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {identity?.getPrincipal().toString().slice(0, 10)}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                data-ocid="admin.logout_button"
                className="text-foreground/70"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              data-ocid="admin.login_button"
              className="btn-primary"
            >
              {loginStatus === "logging-in" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Login with Internet Identity
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isLoggedIn ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            data-ocid="admin.login_panel"
          >
            <div className="glass rounded-2xl p-12 max-w-md w-full space-y-6">
              <Shield className="w-16 h-16 text-primary mx-auto animate-pulse-glow" />
              <h2 className="font-display text-3xl font-bold">Admin Access</h2>
              <p className="text-muted-foreground">
                Please login with Internet Identity to access the admin
                dashboard.
              </p>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="admin.login_primary_button"
                className="btn-primary w-full py-3"
              >
                {loginStatus === "logging-in" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                Login with Internet Identity
              </Button>
            </div>
          </div>
        ) : adminLoading ? (
          <div
            className="flex items-center justify-center min-h-[60vh]"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !isAdmin ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            data-ocid="admin.error_state"
          >
            <div className="glass rounded-2xl p-12 max-w-md w-full space-y-6">
              <X className="w-16 h-16 text-destructive mx-auto" />
              <h2 className="font-display text-3xl">Not Authorized</h2>
              <p className="text-muted-foreground">
                Your account is not registered as admin. Use the setup below to
                register.
              </p>
              <div className="space-y-3 text-left">
                <Label className="text-foreground/80">Admin Secret Key</Label>
                <Input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret"
                  className="glass border-border/50 bg-transparent text-foreground"
                />
                <Button
                  onClick={handleInitAdmin}
                  disabled={!adminSecret || initAdmin.isPending}
                  className="btn-primary w-full"
                >
                  {initAdmin.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4 mr-2" />
                  )}
                  Initialize Admin Access
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={onExit}
                className="text-foreground/60"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="glass border border-border/30 p-1 h-auto">
              <TabsTrigger
                value="projects"
                data-ocid="admin.projects.tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
              >
                <Eye className="w-4 h-4" /> Projects
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                data-ocid="admin.comments.tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Comments
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                data-ocid="admin.analytics.tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
              >
                <BarChart3 className="w-4 h-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger
                value="setup"
                data-ocid="admin.setup.tab"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary gap-2"
              >
                <Shield className="w-4 h-4" /> Setup
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Projects</h2>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  data-ocid="admin.project.open_modal_button"
                  className="btn-primary gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </Button>
              </div>

              {showAddForm && (
                <div
                  className="glass rounded-2xl p-6"
                  data-ocid="admin.project.dialog"
                >
                  <h3 className="font-display text-xl mb-4">New Project</h3>
                  <ProjectForm
                    onSave={handleCreateProject}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              )}

              <div className="space-y-4" data-ocid="admin.projects.list">
                {projects.map((project, idx) => (
                  <div
                    key={project.id.toString()}
                    className="glass rounded-xl p-5"
                    data-ocid={`admin.projects.item.${idx + 1}`}
                  >
                    {editingProject?.id === project.id ? (
                      <div>
                        <h3 className="font-display text-lg mb-4">
                          Editing: {project.title}
                        </h3>
                        <ProjectForm
                          project={project}
                          onSave={handleUpdateProject}
                          onCancel={() => setEditingProject(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1 min-w-0">
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {project.url}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs bg-primary/20 text-primary border-primary/30"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="w-3 h-3" />
                            <ProjectLikes projectId={project.id} />
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProject(project)}
                            data-ocid={`admin.projects.edit_button.${idx + 1}`}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            data-ocid={`admin.projects.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {projects.length === 0 && (
                  <div
                    className="glass rounded-xl p-8 text-center"
                    data-ocid="admin.projects.empty_state"
                  >
                    <p className="text-muted-foreground">
                      No projects yet. Add your first project above.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-4">
              <h2 className="font-display text-2xl font-bold">Comments</h2>
              <div className="space-y-3" data-ocid="admin.comments.list">
                {allComments.map((comment, idx) => (
                  <div
                    key={comment.id.toString()}
                    className="glass rounded-xl p-4"
                    data-ocid={`admin.comments.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {comment.authorName}
                          </span>
                          <Badge
                            className={
                              comment.approved
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {comment.approved ? "Approved" : "Pending"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Project #{comment.projectId.toString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-1">
                          {comment.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            Number(comment.timestamp) / 1_000_000,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!comment.approved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveComment(comment.id)}
                            data-ocid={`admin.comments.confirm_button.${idx + 1}`}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          data-ocid={`admin.comments.delete_button.${idx + 1}`}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {allComments.length === 0 && (
                  <div
                    className="glass rounded-xl p-8 text-center"
                    data-ocid="admin.comments.empty_state"
                  >
                    <p className="text-muted-foreground">No comments yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground text-sm mb-1">
                    Total Visits
                  </p>
                  <p className="font-display text-4xl font-bold text-primary">
                    {stats?.totalVisits?.toString() ?? "0"}
                  </p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground text-sm mb-1">
                    Unique Visitors
                  </p>
                  <p className="font-display text-4xl font-bold text-secondary">
                    {stats?.uniqueVisitors?.toString() ?? "0"}
                  </p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <p className="text-muted-foreground text-sm mb-1">
                    Total Projects
                  </p>
                  <p
                    className="font-display text-4xl font-bold"
                    style={{ color: "oklch(0.7 0.18 200)" }}
                  >
                    {projects.length}
                  </p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl mb-4">
                  Project Engagement
                </h3>
                <div className="space-y-3">
                  {projects.map((project, idx) => (
                    <div
                      key={project.id.toString()}
                      className="flex items-center justify-between"
                      data-ocid={`admin.analytics.item.${idx + 1}`}
                    >
                      <span className="text-sm font-medium">
                        {project.title}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="w-3 h-3" />
                        <ProjectLikes projectId={project.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl mb-4">
                  Contact Messages ({contactMessages.length})
                </h3>
                <div className="space-y-3">
                  {contactMessages.map((msg, idx) => (
                    <div
                      key={msg.id.toString()}
                      className="border border-border/30 rounded-xl p-4"
                      data-ocid={`admin.messages.item.${idx + 1}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.email}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1">
                        {msg.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          Number(msg.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {contactMessages.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No contact messages yet.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Admin Setup</h2>
              <div className="glass rounded-2xl p-6 max-w-md space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Re-Initialize Admin Access</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this to register your current principal as admin using the
                  secret key.
                </p>
                <div className="space-y-3">
                  <Label className="text-foreground/80">Secret Key</Label>
                  <Input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter admin secret"
                    className="glass border-border/50 bg-transparent text-foreground"
                  />
                  <Button
                    onClick={handleInitAdmin}
                    disabled={!adminSecret || initAdmin.isPending}
                    data-ocid="admin.setup.submit_button"
                    className="btn-primary w-full"
                  >
                    {initAdmin.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Initialize
                  </Button>
                  {initAdmin.isSuccess && (
                    <p
                      className="text-sm text-green-400"
                      data-ocid="admin.setup.success_state"
                    >
                      Admin initialized! Please refresh the page.
                    </p>
                  )}
                  {initAdmin.isError && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="admin.setup.error_state"
                    >
                      Failed to initialize. Check your secret key.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
