// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const Project = IDL.Record({
    'id': IDL.Nat,
    'title': IDL.Text,
    'description': IDL.Text,
    'url': IDL.Text,
    'imageUrl': IDL.Text,
    'tags': IDL.Vec(IDL.Text),
    'createdAt': IDL.Int,
  });
  const Comment = IDL.Record({
    'id': IDL.Nat,
    'projectId': IDL.Nat,
    'author': IDL.Principal,
    'authorName': IDL.Text,
    'content': IDL.Text,
    'timestamp': IDL.Int,
    'approved': IDL.Bool,
  });
  const ContactMessage = IDL.Record({
    'id': IDL.Nat,
    'name': IDL.Text,
    'email': IDL.Text,
    'message': IDL.Text,
    'timestamp': IDL.Int,
  });
  const VisitorStats = IDL.Record({
    'totalVisits': IDL.Nat,
    'uniqueVisitors': IDL.Nat,
  });
  const UserRole = IDL.Variant({
    'admin': IDL.Null,
    'user': IDL.Null,
    'guest': IDL.Null,
  });
  return IDL.Service({
    '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
    'createProject': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], [IDL.Nat], []),
    'updateProject': IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], [IDL.Bool], []),
    'deleteProject': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getProjects': IDL.Func([], [IDL.Vec(Project)], ['query']),
    'getProject': IDL.Func([IDL.Nat], [IDL.Opt(Project)], ['query']),
    'toggleLike': IDL.Func([IDL.Nat], [IDL.Nat], []),
    'getLikeCount': IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'hasLiked': IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
    'addComment': IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Nat], []),
    'deleteComment': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'approveComment': IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getComments': IDL.Func([IDL.Nat], [IDL.Vec(Comment)], ['query']),
    'getAllComments': IDL.Func([], [IDL.Vec(Comment)], []),
    'recordVisit': IDL.Func([], [], []),
    'getVisitorStats': IDL.Func([], [VisitorStats], ['query']),
    'submitContact': IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getContactMessages': IDL.Func([], [IDL.Vec(ContactMessage)], []),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
