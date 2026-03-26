import AccessControl "./authorization/access-control";
import MixinAuthorization "./authorization/MixinAuthorization";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor class Portfolio() = this {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextProjectId : Nat = 1;
  var nextCommentId : Nat = 1;
  var nextContactId : Nat = 1;
  var totalVisits : Nat = 0;

  public type Project = {
    id : Nat;
    title : Text;
    description : Text;
    url : Text;
    imageUrl : Text;
    tags : [Text];
    createdAt : Int;
  };

  public type Comment = {
    id : Nat;
    projectId : Nat;
    author : Principal;
    authorName : Text;
    content : Text;
    timestamp : Int;
    approved : Bool;
  };

  public type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  public type VisitorStats = {
    totalVisits : Nat;
    uniqueVisitors : Nat;
  };

  let projects = Map.empty<Nat, Project>();
  let comments = Map.empty<Nat, Comment>();
  let projectLikes = Map.empty<Nat, Map.Map<Principal, Bool>>();
  let visitors = Map.empty<Principal, Bool>();
  let contactMessages = Map.empty<Nat, ContactMessage>();

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
  };

  // ===== PROJECTS =====
  public shared ({ caller }) func createProject(title : Text, description : Text, url : Text, imageUrl : Text, tags : [Text]) : async Nat {
    requireAdmin(caller);
    let id = nextProjectId;
    nextProjectId += 1;
    projects.add(id, { id; title; description; url; imageUrl; tags; createdAt = Time.now() });
    id
  };

  public shared ({ caller }) func updateProject(id : Nat, title : Text, description : Text, url : Text, imageUrl : Text, tags : [Text]) : async Bool {
    requireAdmin(caller);
    switch (projects.get(id)) {
      case (null) { false };
      case (?p) {
        projects.add(id, { id; title; description; url; imageUrl; tags; createdAt = p.createdAt });
        true
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async Bool {
    requireAdmin(caller);
    if (projects.containsKey(id)) {
      projects.remove(id);
      true
    } else {
      false
    };
  };

  public query func getProjects() : async [Project] {
    projects.values().toArray()
  };

  public query func getProject(id : Nat) : async ?Project {
    projects.get(id)
  };

  // ===== LIKES =====
  public shared ({ caller }) func toggleLike(projectId : Nat) : async Nat {
    let likesMap = switch (projectLikes.get(projectId)) {
      case (?m) { m };
      case (null) {
        let m = Map.empty<Principal, Bool>();
        projectLikes.add(projectId, m);
        m
      };
    };
    if (likesMap.containsKey(caller)) {
      likesMap.remove(caller);
    } else {
      likesMap.add(caller, true);
    };
    likesMap.size()
  };

  public query func getLikeCount(projectId : Nat) : async Nat {
    switch (projectLikes.get(projectId)) {
      case (null) { 0 };
      case (?m) { m.size() };
    };
  };

  public query ({ caller }) func hasLiked(projectId : Nat) : async Bool {
    switch (projectLikes.get(projectId)) {
      case (null) { false };
      case (?m) { m.containsKey(caller) };
    };
  };

  // ===== COMMENTS =====
  public shared ({ caller }) func addComment(projectId : Nat, authorName : Text, content : Text) : async Nat {
    let id = nextCommentId;
    nextCommentId += 1;
    comments.add(id, { id; projectId; author = caller; authorName; content; timestamp = Time.now(); approved = false });
    id
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async Bool {
    switch (comments.get(commentId)) {
      case (null) { false };
      case (?c) {
        if (c.author == caller or AccessControl.isAdmin(accessControlState, caller)) {
          comments.remove(commentId);
          true
        } else {
          Runtime.trap("Unauthorized");
        };
      };
    };
  };

  public shared ({ caller }) func approveComment(commentId : Nat) : async Bool {
    requireAdmin(caller);
    switch (comments.get(commentId)) {
      case (null) { false };
      case (?c) {
        comments.add(commentId, { id = c.id; projectId = c.projectId; author = c.author; authorName = c.authorName; content = c.content; timestamp = c.timestamp; approved = true });
        true
      };
    };
  };

  public query func getComments(projectId : Nat) : async [Comment] {
    let all = comments.values().toArray();
    all.filter(func(c : Comment) : Bool { c.projectId == projectId and c.approved })
  };

  public shared ({ caller }) func getAllComments() : async [Comment] {
    requireAdmin(caller);
    comments.values().toArray()
  };

  // ===== VISITOR TRACKING =====
  public shared ({ caller }) func recordVisit() : async () {
    totalVisits += 1;
    if (not caller.isAnonymous()) {
      visitors.add(caller, true);
    };
  };

  public query func getVisitorStats() : async VisitorStats {
    { totalVisits; uniqueVisitors = visitors.size() }
  };

  // ===== CONTACT FORM =====
  public shared func submitContact(name : Text, email : Text, message : Text) : async Nat {
    let id = nextContactId;
    nextContactId += 1;
    contactMessages.add(id, { id; name; email; message; timestamp = Time.now() });
    id
  };

  public shared ({ caller }) func getContactMessages() : async [ContactMessage] {
    requireAdmin(caller);
    contactMessages.values().toArray()
  };
}
