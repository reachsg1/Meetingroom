// 관리자용 API: /api/admin?action=...
const route = require('../lib/route');
const svc = require('../lib/service');
const { httpError, safeEqual, signToken, str, kstNow } = require('../lib/util');

const actor = (user) => (user && user.name ? `관리자(${user.name})` : '관리자');

module.exports = route(
  {
    'POST login': async ({ body }) => {
      const pw = process.env.ADMIN_PASSWORD;
      if (!pw) throw httpError(503, '관리자 비밀번호(ADMIN_PASSWORD)가 설정되지 않았습니다.');
      if (!safeEqual(String(body.password || ''), pw)) {
        await new Promise((r) => setTimeout(r, 700)); // 무차별 대입 완화
        throw httpError(401, '관리자 비밀번호가 맞지 않습니다.');
      }
      const name = str(body.name, 20);
      return { token: signToken({ role: 'admin', name, exp: Date.now() + 12 * 3600e3 }), name };
    },
    'GET list': ({ query }) => svc.adminList(query),
    'GET logs': ({ query }) => svc.adminLogs({ bookingId: query.bookingId, limit: query.limit, offset: query.offset }),
    'GET stats': ({ query }) => svc.adminStats({ month: query.month }),
    'GET export': async ({ query, res }) => {
      const csv = await svc.adminExport(query);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="meeting-room_${query.from}_${query.to}.csv"`);
      res.status(200).send(csv);
    },
    'POST create': ({ body, user }) => svc.createBooking(body, { admin: true, actor: actor(user) }),
    'POST update': ({ body, user }) => svc.updateBooking(body.id, body, { admin: true, actor: actor(user) }),
    'POST cancel': ({ body, user }) =>
      svc.cancelBooking(body.id, { admin: true, actor: actor(user), scope: body.scope, reason: body.reason }),
    'POST restore': ({ body, user }) => svc.restoreBooking(body.id, { actor: actor(user) }),
    'POST swap': ({ body, user }) => svc.swapBookings(body.a, body.b, { actor: actor(user) }),
    'GET ping': () => ({ ok: true, now: kstNow() }),
  },
  { admin: true, adminOpen: ['POST login'] }
);
