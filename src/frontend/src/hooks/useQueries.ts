import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Comment,
  ContactMessage,
  Project,
  VisitorStats,
  backendInterface,
} from "../backend.d";
import { useActor } from "./useActor";

type Actor = backendInterface;

function getActor(actor: unknown): Actor {
  return actor as Actor;
}

export function useProjects() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!rawActor) return [];
      return getActor(rawActor).getProjects();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useVisitorStats() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<VisitorStats>({
    queryKey: ["visitorStats"],
    queryFn: async () => {
      if (!rawActor) return { totalVisits: 0n, uniqueVisitors: 0n };
      return getActor(rawActor).getVisitorStats();
    },
    enabled: !!rawActor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useComments(projectId: bigint, enabled = true) {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["comments", projectId.toString()],
    queryFn: async () => {
      if (!rawActor) return [];
      return getActor(rawActor).getComments(projectId);
    },
    enabled: !!rawActor && !isFetching && enabled,
  });
}

export function useAllComments() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["allComments"],
    queryFn: async () => {
      if (!rawActor) return [];
      return getActor(rawActor).getAllComments();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useLikeCount(projectId: bigint) {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["likes", projectId.toString()],
    queryFn: async () => {
      if (!rawActor) return 0n;
      return getActor(rawActor).getLikeCount(projectId);
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useHasLiked(projectId: bigint) {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["hasLiked", projectId.toString()],
    queryFn: async () => {
      if (!rawActor) return false;
      return getActor(rawActor).hasLiked(projectId);
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!rawActor) return false;
      return getActor(rawActor).isCallerAdmin();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useContactMessages() {
  const { actor: rawActor, isFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!rawActor) return [];
      return getActor(rawActor).getContactMessages();
    },
    enabled: !!rawActor && !isFetching,
  });
}

export function useToggleLike() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).toggleLike(projectId);
    },
    onSuccess: (newCount, projectId) => {
      queryClient.setQueryData(["likes", projectId.toString()], newCount);
      queryClient.invalidateQueries({
        queryKey: ["hasLiked", projectId.toString()],
      });
    },
  });
}

export function useAddComment() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      authorName,
      content,
    }: { projectId: bigint; authorName: string; content: string }) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).addComment(projectId, authorName, content);
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", projectId.toString()],
      });
    },
  });
}

export function useApproveComment() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).approveComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
    },
  });
}

export function useDeleteComment() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useCreateProject() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      url: string;
      imageUrl: string;
      tags: string[];
    }) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).createProject(
        data.title,
        data.description,
        data.url,
        data.imageUrl,
        data.tags,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      url: string;
      imageUrl: string;
      tags: string[];
    }) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).updateProject(
        data.id,
        data.title,
        data.description,
        data.url,
        data.imageUrl,
        data.tags,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor: rawActor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useSubmitContact() {
  const { actor: rawActor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).submitContact(
        data.name,
        data.email,
        data.message,
      );
    },
  });
}

export function useRecordVisit() {
  const { actor: rawActor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor).recordVisit();
    },
  });
}

export function useInitAdmin() {
  const { actor: rawActor } = useActor();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!rawActor) throw new Error("No actor");
      return getActor(rawActor)._initializeAccessControlWithSecret(secret);
    },
  });
}
