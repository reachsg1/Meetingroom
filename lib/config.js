// 운영 규칙. Vercel 환경변수로 덮어쓸 수 있습니다(README 참고).
const env = process.env;
const num = (v, d) => (v !== undefined && v !== '' && !isNaN(Number(v)) ? Number(v) : d);
const list = (v, d) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : d);

module.exports = {
  orgName: env.ORG_NAME || '농촌진흥청 연구정책국',
  roomName: env.ROOM_NAME || '연구정책국 회의실',
  roomLocation: env.ROOM_LOCATION || '',
  capacity: num(env.ROOM_CAPACITY, 0), // 0이면 표시 안 함
  openTime: env.OPEN_TIME || '08:00',
  closeTime: env.CLOSE_TIME || '20:00',
  slotMinutes: num(env.SLOT_MINUTES, 30),
  maxHours: num(env.MAX_HOURS, 4), // 1회 최대 이용시간(관리자는 제한 없음)
  maxAdvanceDays: num(env.MAX_ADVANCE_DAYS, 90), // 며칠 앞까지 예약 가능
  maxRepeatWeeks: num(env.MAX_REPEAT_WEEKS, 12), // 매주 반복 최대 주수
  depts: list(env.DEPTS, ['국장실', '연구정책과', '연구개발과', '연구관리과', '농자재산업과', '스마트농업팀']),
  // 음력·대체공휴일 등 해마다 바뀌는 휴일(양력 고정 공휴일은 자동 표시)
  // 기본값: 2027년 설·부처님오신날·추석과 대체공휴일. 해가 바뀌면 HOLIDAYS 환경변수로 추가하세요(표시용, 예약은 막지 않음).
  holidays: list(env.HOLIDAYS, [
    '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', '2027-05-13', '2027-08-16',
    '2027-09-14', '2027-09-15', '2027-09-16', '2027-10-04', '2027-10-11', '2027-12-27',
  ]),
};
