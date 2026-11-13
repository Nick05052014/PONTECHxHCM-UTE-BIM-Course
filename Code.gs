/*** Pontech × HCM-UTE — Bài kiểm tra BIM Buổi 1 ***
 *  Backend Google Apps Script: phục vụ trang kiểm tra (doGet)
 *  và nhận bài nộp, tự chấm trắc nghiệm, ghi vào Google Sheet.
 *  ĐÁP ÁN nằm ở đây (server) nên sinh viên không xem được trong trang.
 ************************************************************/

var TOTAL = 16;
// Đáp án đúng (0 = A, 1 = B, 2 = C, 3 = D) cho câu 1..16
var KEY = [1,1,2,0,1,2,1,2,1,1,1,1,1,0,1,1];

var HEADERS = ['Thời gian','Họ tên','MSSV']
  .concat(makeSeq_('TN', TOTAL))
  .concat(['Điểm TN (/' + TOTAL + ')','Tự luận 1','Tự luận 2','Tự luận 3']);

function makeSeq_(prefix, n){
  var a = [];
  for (var i = 1; i <= n; i++) a.push(prefix + i);
  return a;
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Kiểm tra BIM — Buổi 1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('KetQua');
  if (!sh) sh = ss.insertSheet('KetQua');
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

/** Được gọi từ trang qua google.script.run */
function submitQuiz(payload) {
  var name = (payload && payload.name ? String(payload.name) : '').trim();
  var mssv = (payload && payload.mssv ? String(payload.mssv) : '').trim();
  if (!name || !mssv) throw new Error('Vui lòng nhập Họ tên và MSSV.');

  var answers = (payload && payload.answers) || [];
  var essays  = (payload && payload.essays)  || [];
  var letters = ['A','B','C','D'];
  var score = 0;
  var ansCols = [];
  for (var i = 0; i < TOTAL; i++) {
    var a = answers[i];
    if (a === KEY[i]) score++;
    ansCols.push((a === null || a === undefined || a === '') ? '' : (letters[a] || ''));
  }

  var row = [new Date(), name, mssv]
    .concat(ansCols)
    .concat([score, essays[0] || '', essays[1] || '', essays[2] || '']);

  getSheet_().appendRow(row);
  return { ok: true, score: score, total: TOTAL };
}
