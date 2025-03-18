import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table
  users: defineTable({
    username: v.string(),
    fullname: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    clerkId: v.string(),
  }).index('by_clerk_id', ['clerkId']),

  // Posts table
  posts: defineTable({
    userId: v.id('users'), // Reference to the user who created the post
    imageUrl: v.optional(v.string()),
    storageId: v.id('_storage'),
    caption: v.optional(v.string()),
    likes: v.number(),
    comments: v.number(),
  }).index('by_user', ['userId']),

  // Comments table
  comments: defineTable({
    postId: v.id('posts'), // Reference to the post
    userId: v.id('users'), // Reference to the user who commented
    content: v.string(),
  }).index('by_post', ['postId']),

  // Likes table
  likes: defineTable({
    userId: v.id('users'), // Reference to the user who liked
    postId: v.optional(v.id('posts')), // Reference to the post (if liked)
  }).index('by_post', ['postId']).index('by_user_and_post',['userId','postId']),


  follows: defineTable({
    followerId: v.id('users'), // The user who is following
    followingId: v.id('users'), // The user being followed
  })
  .index('by_follower', ['followerId']) // Index to find all users a specific user is following
  .index('by_following', ['followingId'])
  .index('by_both', ['followerId','followingId']),

  notifications: defineTable({
    receiverId: v.id('users'), 
    senderId: v.id('users'), 
    type: v.union(v.id('like'), v.id('comments'), v.id('follow')), // Reference to the related entity
    postId: v.optional(v.id('posts')),
    commendId: v.optional(v.id('comments')),
    isRead: v.boolean(), // Read status of the notification
  })
  .index('by_receiver', ['receiverId']),
  // Bookmarks table: Stores user bookmarks

  bookmarks: defineTable({
    userId: v.id('users'), // Reference to the user who created the bookmark
    postId: v.id('posts'), // Reference to the content being bookmarked
  })
  .index('by_user', ['userId']) // Index to retrieve bookmarks for a specific user
  .index('by_post', ['postId'])
  .index('by_user_and_post', ['userId','postId'])

});
