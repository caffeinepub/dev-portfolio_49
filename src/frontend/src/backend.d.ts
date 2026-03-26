import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Project {
    id: bigint;
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    tags: string[];
    createdAt: bigint;
}

export interface Comment {
    id: bigint;
    projectId: bigint;
    author: Principal;
    authorName: string;
    content: string;
    timestamp: bigint;
    approved: boolean;
}

export interface ContactMessage {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}

export interface VisitorStats {
    totalVisits: bigint;
    uniqueVisitors: bigint;
}

export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface backendInterface {
    _initializeAccessControlWithSecret: (userSecret: string) => Promise<void>;
    createProject: (title: string, description: string, url: string, imageUrl: string, tags: string[]) => Promise<bigint>;
    updateProject: (id: bigint, title: string, description: string, url: string, imageUrl: string, tags: string[]) => Promise<boolean>;
    deleteProject: (id: bigint) => Promise<boolean>;
    getProjects: () => Promise<Project[]>;
    getProject: (id: bigint) => Promise<[] | [Project]>;
    toggleLike: (projectId: bigint) => Promise<bigint>;
    getLikeCount: (projectId: bigint) => Promise<bigint>;
    hasLiked: (projectId: bigint) => Promise<boolean>;
    addComment: (projectId: bigint, authorName: string, content: string) => Promise<bigint>;
    deleteComment: (commentId: bigint) => Promise<boolean>;
    approveComment: (commentId: bigint) => Promise<boolean>;
    getComments: (projectId: bigint) => Promise<Comment[]>;
    getAllComments: () => Promise<Comment[]>;
    recordVisit: () => Promise<void>;
    getVisitorStats: () => Promise<VisitorStats>;
    submitContact: (name: string, email: string, message: string) => Promise<bigint>;
    getContactMessages: () => Promise<ContactMessage[]>;
    isCallerAdmin: () => Promise<boolean>;
    getCallerUserRole: () => Promise<UserRole>;
    assignCallerUserRole: (user: Principal, role: UserRole) => Promise<void>;
}
