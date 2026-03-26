/* eslint-disable */
// @ts-nocheck
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface Project {
    'id': bigint;
    'title': string;
    'description': string;
    'url': string;
    'imageUrl': string;
    'tags': Array<string>;
    'createdAt': bigint;
}
export interface Comment {
    'id': bigint;
    'projectId': bigint;
    'author': Principal;
    'authorName': string;
    'content': string;
    'timestamp': bigint;
    'approved': boolean;
}
export interface ContactMessage {
    'id': bigint;
    'name': string;
    'email': string;
    'message': string;
    'timestamp': bigint;
}
export interface VisitorStats {
    'totalVisits': bigint;
    'uniqueVisitors': bigint;
}
export type UserRole = { 'admin': null } | { 'user': null } | { 'guest': null };
export interface _SERVICE {
    '_initializeAccessControlWithSecret': ActorMethod<[string], undefined>;
    'createProject': ActorMethod<[string, string, string, string, string[]], bigint>;
    'updateProject': ActorMethod<[bigint, string, string, string, string, string[]], boolean>;
    'deleteProject': ActorMethod<[bigint], boolean>;
    'getProjects': ActorMethod<[], Array<Project>>;
    'getProject': ActorMethod<[bigint], [] | [Project]>;
    'toggleLike': ActorMethod<[bigint], bigint>;
    'getLikeCount': ActorMethod<[bigint], bigint>;
    'hasLiked': ActorMethod<[bigint], boolean>;
    'addComment': ActorMethod<[bigint, string, string], bigint>;
    'deleteComment': ActorMethod<[bigint], boolean>;
    'approveComment': ActorMethod<[bigint], boolean>;
    'getComments': ActorMethod<[bigint], Array<Comment>>;
    'getAllComments': ActorMethod<[], Array<Comment>>;
    'recordVisit': ActorMethod<[], undefined>;
    'getVisitorStats': ActorMethod<[], VisitorStats>;
    'submitContact': ActorMethod<[string, string, string], bigint>;
    'getContactMessages': ActorMethod<[], Array<ContactMessage>>;
    'isCallerAdmin': ActorMethod<[], boolean>;
    'getCallerUserRole': ActorMethod<[], UserRole>;
    'assignCallerUserRole': ActorMethod<[Principal, UserRole], undefined>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
