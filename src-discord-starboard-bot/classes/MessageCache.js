module.exports = class MessageCache {
  constructor() {
    this.cache = {};
  }

  has(key) {
    return key in this.cache;
  }

  createMessage(key) {
    this.cache[key] = {
      starred: false,
      upvoteUsers: new Set(),
      downvoteUsers: new Set(),
    };
  }

  isStarred(key) {
    return this.cache[key].starred;
  }

  addToUpvoteUsers(key, userId) {
    this.cache[key].upvoteUsers.add(userId);
  }

  addToDownvoteUsers(key, userId) {
    this.cache[key].downvoteUsers.add(userId);
  }

  getNetVotes(key) {
    return (
      this.cache[key].upvoteUsers.size - this.cache[key].downvoteUsers.size
    );
  }

  clearMessage(key) {
    this.cache[key].starred = true;
    delete this.cache[key].upvoteUsers;
    delete this.cache[key].downvoteUsers;
  }
};
