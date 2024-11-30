"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeToCommentsRelations = exports.likeToCommentsCommentRelations = exports.likeToComments = exports.likeToCommentComments = exports.likesToHistoriesRelations = exports.likesToHistories = exports.commentsToCommentsPageRelations = exports.pageCommentsToPageComments = exports.pageCommentsRelations = exports.pageComments = exports.genresToHistoriesRelations = exports.genresToHistories = exports.genresRelations = exports.genres = exports.similarHistoriesRelation = exports.similarHistories = exports.likePagesRelations = exports.likePages = exports.charactersToUsersRelations = exports.charactersToUsers = exports.charactersRelation = exports.characters = exports.bookmarksToHistoriesRelations = exports.bookmarksToHistories = exports.bookmarksRelations = exports.bookmarks = exports.pagePointsRelations = exports.historyPointsRelations = exports.variablesRelations = exports.variables = exports.pagesRelations = exports.pages = exports.pagePoints = exports.historyPoints = exports.commentsToCommentsRelations = exports.commentsToComments = exports.commentsRelations = exports.comments = exports.tagsToPagesRelations = exports.tagsToPages = exports.tags = exports.historiesRelations = exports.histories = exports.usersRelations = exports.dignityRelations = exports.users = exports.layouts = exports.dignity = void 0;
const user_1 = require("../entities/user/model/user");
Object.defineProperty(exports, "users", { enumerable: true, get: function () { return user_1.users; } });
Object.defineProperty(exports, "usersRelations", { enumerable: true, get: function () { return user_1.usersRelations; } });
Object.defineProperty(exports, "dignity", { enumerable: true, get: function () { return user_1.dignity; } });
Object.defineProperty(exports, "dignityRelations", { enumerable: true, get: function () { return user_1.dignityRelations; } });
const page_1 = require("../entities/page/model/page");
Object.defineProperty(exports, "likePages", { enumerable: true, get: function () { return page_1.likePages; } });
Object.defineProperty(exports, "likePagesRelations", { enumerable: true, get: function () { return page_1.likePagesRelations; } });
Object.defineProperty(exports, "pageComments", { enumerable: true, get: function () { return page_1.pageComments; } });
Object.defineProperty(exports, "pageCommentsRelations", { enumerable: true, get: function () { return page_1.pageCommentsRelations; } });
Object.defineProperty(exports, "pageCommentsToPageComments", { enumerable: true, get: function () { return page_1.pageCommentsToPageComments; } });
Object.defineProperty(exports, "commentsToCommentsPageRelations", { enumerable: true, get: function () { return page_1.commentsToCommentsPageRelations; } });
Object.defineProperty(exports, "pagePoints", { enumerable: true, get: function () { return page_1.pagePoints; } });
Object.defineProperty(exports, "pagePointsRelations", { enumerable: true, get: function () { return page_1.pagePointsRelations; } });
Object.defineProperty(exports, "pages", { enumerable: true, get: function () { return page_1.pages; } });
Object.defineProperty(exports, "pagesRelations", { enumerable: true, get: function () { return page_1.pagesRelations; } });
Object.defineProperty(exports, "variables", { enumerable: true, get: function () { return page_1.variables; } });
Object.defineProperty(exports, "variablesRelations", { enumerable: true, get: function () { return page_1.variablesRelations; } });
Object.defineProperty(exports, "layouts", { enumerable: true, get: function () { return page_1.layouts; } });
Object.defineProperty(exports, "tags", { enumerable: true, get: function () { return page_1.tags; } });
Object.defineProperty(exports, "tagsToPages", { enumerable: true, get: function () { return page_1.tagsToPages; } });
Object.defineProperty(exports, "tagsToPagesRelations", { enumerable: true, get: function () { return page_1.tagsToPagesRelations; } });
const history_1 = require("../entities/history/model/history");
Object.defineProperty(exports, "histories", { enumerable: true, get: function () { return history_1.histories; } });
Object.defineProperty(exports, "historiesRelations", { enumerable: true, get: function () { return history_1.historiesRelations; } });
Object.defineProperty(exports, "comments", { enumerable: true, get: function () { return history_1.comments; } });
Object.defineProperty(exports, "commentsRelations", { enumerable: true, get: function () { return history_1.commentsRelations; } });
Object.defineProperty(exports, "historyPoints", { enumerable: true, get: function () { return history_1.historyPoints; } });
Object.defineProperty(exports, "historyPointsRelations", { enumerable: true, get: function () { return history_1.historyPointsRelations; } });
Object.defineProperty(exports, "characters", { enumerable: true, get: function () { return history_1.characters; } });
Object.defineProperty(exports, "charactersRelation", { enumerable: true, get: function () { return history_1.charactersRelation; } });
Object.defineProperty(exports, "charactersToUsers", { enumerable: true, get: function () { return history_1.charactersToUsers; } });
Object.defineProperty(exports, "charactersToUsersRelations", { enumerable: true, get: function () { return history_1.charactersToUsersRelations; } });
Object.defineProperty(exports, "similarHistories", { enumerable: true, get: function () { return history_1.similarHistories; } });
Object.defineProperty(exports, "similarHistoriesRelation", { enumerable: true, get: function () { return history_1.similarHistoriesRelation; } });
Object.defineProperty(exports, "genres", { enumerable: true, get: function () { return history_1.genres; } });
Object.defineProperty(exports, "genresRelations", { enumerable: true, get: function () { return history_1.genresRelations; } });
Object.defineProperty(exports, "genresToHistories", { enumerable: true, get: function () { return history_1.genresToHistories; } });
Object.defineProperty(exports, "genresToHistoriesRelations", { enumerable: true, get: function () { return history_1.genresToHistoriesRelations; } });
Object.defineProperty(exports, "commentsToComments", { enumerable: true, get: function () { return history_1.commentsToComments; } });
Object.defineProperty(exports, "commentsToCommentsRelations", { enumerable: true, get: function () { return history_1.commentsToCommentsRelations; } });
Object.defineProperty(exports, "bookmarksToHistories", { enumerable: true, get: function () { return history_1.bookmarksToHistories; } });
Object.defineProperty(exports, "bookmarksToHistoriesRelations", { enumerable: true, get: function () { return history_1.bookmarksToHistoriesRelations; } });
Object.defineProperty(exports, "likesToHistories", { enumerable: true, get: function () { return history_1.likesToHistories; } });
Object.defineProperty(exports, "likesToHistoriesRelations", { enumerable: true, get: function () { return history_1.likesToHistoriesRelations; } });
Object.defineProperty(exports, "likeToCommentComments", { enumerable: true, get: function () { return history_1.likeToCommentComments; } });
Object.defineProperty(exports, "likeToComments", { enumerable: true, get: function () { return history_1.likeToComments; } });
Object.defineProperty(exports, "likeToCommentsCommentRelations", { enumerable: true, get: function () { return history_1.likeToCommentsCommentRelations; } });
Object.defineProperty(exports, "likeToCommentsRelations", { enumerable: true, get: function () { return history_1.likeToCommentsRelations; } });
const bookmark_1 = require("../entities/bookmark/model/bookmark");
Object.defineProperty(exports, "bookmarks", { enumerable: true, get: function () { return bookmark_1.bookmarks; } });
Object.defineProperty(exports, "bookmarksRelations", { enumerable: true, get: function () { return bookmark_1.bookmarksRelations; } });
