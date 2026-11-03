// 일반 사용자용 API: /api/bookings?action=...
const route = require('../lib/route');
const svc = require('../lib/service');

module.exports = route(
  {
    'GET config': () => svc.getConfig(),
    'GET list': ({ query }) => svc.listBookings(query.from, query.to),
    'GET mine': ({ query }) => svc.findByApplicant(query.name),
    'POST create': ({ body }) => svc.createBooking(body, { admin: false }),
    'POST update': ({ body }) => svc.updateBooking(body.id, body, { admin: false, pin: body.pin }),
    'POST cancel': ({ body }) => svc.cancelBooking(body.id, { admin: false, pin: body.pin, scope: body.scope }),
  },
  { open: ['GET config'] }
);
