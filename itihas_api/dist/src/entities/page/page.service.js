'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.createPagePoint =
	exports.updatePage =
	exports.createPage =
	exports.executeActionPage =
	exports.updateAction =
	exports.deleteActionById =
	exports.runCode =
	exports.getCurrentPageByHistoryId =
		void 0;
const db_1 = require('../../database/db');
const content_1 = require('./lib/content');
const drizzle_orm_1 = require('drizzle-orm');
const page_1 = require('./model/page');
const actionV2_1 = require('./lib/actionV2');
const string_1 = require('../../lib/string');
const error_1 = require('../../lib/error');
const user_1 = require('../user/model/user');
const http_status_codes_1 = require('http-status-codes');
const getCurrentPageByHistoryId = (id, currentPage, user) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const firstPage = yield db_1.db
			.select({ id: (0, drizzle_orm_1.min)(page_1.pages.id) })
			.from(page_1.pages)
			.where((0, drizzle_orm_1.eq)(page_1.pages.historyId, id));
		if (firstPage.length == 0 && !firstPage[0].id) {
			throw new error_1.ErrorBoundary(
				'Page not exist in story',
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		const page = yield db_1.db.query.pages.findFirst({
			where: (pages, { eq, and, or }) => {
				let ex;
				if (currentPage == 0) {
					ex = or(eq(pages.type, 'start'), eq(pages.id, firstPage[0].id));
				} else {
					ex = eq(pages.id, currentPage);
				}
				return and(ex, eq(pages.historyId, id));
			},
			with: {
				points: true,
				history: {
					columns: {
						sound: true,
					},
					with: {
						layout: true,
					},
				},
				layout: true,
			},
		});
		if (!page) {
			throw new error_1.ErrorBoundary(
				`Не найдено главы по id ${currentPage}`,
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		const variables = yield db_1.db.query.variables.findMany({
			where: (variables, { eq, and }) =>
				and(eq(variables.historyId, id), eq(variables.userId, user.id)),
		});
		let pagesWithVariables = Object.assign(page, { variables });
		try {
			pagesWithVariables['content'] = yield (0, content_1.insertDataToContent)(
				page.content,
				id,
				user.id
			);
		} catch (error) {
			throw new error_1.ErrorBoundary(
				'Code run failed',
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		if (pagesWithVariables.layout) {
			if (typeof pagesWithVariables.layout.layout == 'string') {
				pagesWithVariables.layout.layout = JSON.parse(
					pagesWithVariables.layout.layout
				);
			}
			const promises = pagesWithVariables.layout.layout.reduce((acc, p) => {
				acc.push(
					p.content
						? (0, content_1.insertDataToContent)(
								p.content,
								pagesWithVariables.historyId,
								user.id
						  )
						: p.content
				);
				return acc;
			}, []);
			const contents = yield Promise.all(promises);
			contents.forEach((c, i) => {
				pagesWithVariables.layout.layout[i].content = c;
			});
		}
		if (pagesWithVariables.variables) {
			pagesWithVariables.variables = pagesWithVariables.variables.map(v => {
				try {
					if (['array', 'object'].includes(v.type)) {
						v.data = JSON.parse((0, string_1.replaceAll)(v.data, '\\', ''));
					}
				} catch (error) {
					if (error instanceof Error) {
						console.log(error);
					}
				}
				return v;
			});
		}
		const promises = page.history.layout.layout.reduce((acc, p) => {
			acc.push(
				p.content
					? (0, content_1.insertDataToContent)(
							p.content,
							page.historyId,
							user.id
					  )
					: null
			);
			return acc;
		}, []);
		const contents = yield Promise.all(promises);
		contents.forEach((c, i) => {
			page.history.layout.layout[i].content = c;
		});
		if (page.script) {
			const tokens = (0, actionV2_1.parse)(page.script);
			const pageId = yield (0, actionV2_1.run)(
				tokens,
				null,
				user,
				page.historyId,
				new Map()
			);
			if (pageId) {
				pagesWithVariables = yield (0, exports.getCurrentPageByHistoryId)(
					id,
					pageId,
					user
				);
			}
		}
		return pagesWithVariables;
	});
exports.getCurrentPageByHistoryId = getCurrentPageByHistoryId;
const runCode = (code, historyId, userId) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const tokens = (0, actionV2_1.parse)(code);
		const user = yield db_1.db.query.users.findFirst({
			where: (0, drizzle_orm_1.eq)(user_1.users.id, userId),
		});
		if (!user) {
			throw new error_1.ErrorBoundary(
				'User not exist',
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		yield (0, actionV2_1.run)(tokens, null, user, historyId, new Map());
	});
exports.runCode = runCode;
const deleteActionById = actionId =>
	__awaiter(void 0, void 0, void 0, function* () {
		yield db_1.db
			.delete(page_1.pagePoints)
			.where((0, drizzle_orm_1.eq)(page_1.pagePoints.id, actionId));
	});
exports.deleteActionById = deleteActionById;
const updateAction = (actionId, data) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const newAction = yield db_1.db
			.update(page_1.pagePoints)
			.set(data)
			.where((0, drizzle_orm_1.eq)(page_1.pagePoints.id, actionId))
			.returning();
		return newAction[0];
	});
exports.updateAction = updateAction;
const executeActionPage = (id, user) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const point = yield db_1.db.query.pagePoints.findFirst({
			where: (points, { eq }) => eq(points.id, id),
			with: {
				page: {
					with: {
						history: true,
					},
				},
			},
		});
		if (!point) {
			throw new error_1.ErrorBoundary(
				'Не найдено пункта по id - ' + id,
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		const tokens = (0, actionV2_1.parse)(point.action);
		const pageId = yield (0, actionV2_1.run)(tokens, null, user, 1, new Map());
		const page = yield (0, exports.getCurrentPageByHistoryId)(
			point.page.historyId,
			pageId == 0 ? id : pageId,
			user
		);
		return page;
	});
exports.executeActionPage = executeActionPage;
const createPage = (id, data) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const existPageByName = yield db_1.db.query.pages.findFirst({
			where: (0, drizzle_orm_1.eq)(page_1.pages.name, data.name),
		});
		if (existPageByName) {
			throw new error_1.ErrorBoundary(
				`Страница с названием ${data.name} уже создана!`,
				http_status_codes_1.ReasonPhrases.BAD_REQUEST
			);
		}
		const value = {
			content: data.content,
			historyId: id,
			name: data.name,
			description: data.description ? data.description : undefined,
			image: data.image ? data.image : undefined,
			sound: data.sound ? data.sound : undefined,
		};
		const page = yield db_1.db.insert(page_1.pages).values(value).returning();
		return page[0];
	});
exports.createPage = createPage;
const updatePage = (id, data) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const updatedPage = yield db_1.db
			.update(page_1.pages)
			.set(data)
			.where((0, drizzle_orm_1.eq)(page_1.pages.id, id))
			.returning();
		return updatedPage[0];
	});
exports.updatePage = updatePage;
const createPagePoint = (pageId, data) =>
	__awaiter(void 0, void 0, void 0, function* () {
		const existPoint = yield db_1.db.query.pagePoints.findFirst({
			where: (0, drizzle_orm_1.eq)(page_1.pagePoints.name, data.name),
		});
		if (existPoint) {
			yield db_1.db.update(page_1.pagePoints).set({
				action: data.action,
				name: data.name,
				pageId: pageId,
			});
			return;
		}
		yield db_1.db.insert(page_1.pagePoints).values({
			action: data.action,
			name: data.name,
			pageId: pageId,
		});
	});
exports.createPagePoint = createPagePoint;
