// ─────────────────────────────────────────────────────────────────
//  Save The Date — Google Apps Script Backend  (v7 — final)
//
//  Reading comments is handled by Google Sheets CSV export directly in
//  the browser. This script handles WRITING (RSVP + comments via POST),
//  plus one narrow read: GET ?rsvp=<name> returns that guest's latest
//  reply (attending + total only; never notes or dietaries).
//
//  Deploy: Execute as Me, Who has access: Anyone
// ─────────────────────────────────────────────────────────────────

var SPREADSHEET_ID      = '1OvPdXsnfmkx3vjcseqSzIJSNIy7B9nMQqdRpQjWIqxA';
var RSVP_SHEET_NAME     = 'RSVPs';
var COMMENTS_SHEET_NAME = 'Comments';


// ─────────────────────────────────────────────────────────────────
//  POST — save RSVP or Comment to the Sheet
// ─────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var raw;
    if (e.postData.type === 'application/json') {
      raw = e.postData.contents;
    } else {
      raw = decodeURIComponent(e.parameter.data || e.postData.contents);
    }

    var data = JSON.parse(raw);

    if (data.type === 'rsvp')         { saveRSVP(data); }
    else if (data.type === 'comment') { saveComment(data); }

    return buildResponse({ success: true });

  } catch (err) {
    return buildResponse({ success: false, error: err.toString() });
  }
}


// ─────────────────────────────────────────────────────────────────
//  GET — ?rsvp=<name>: has this guest already replied? Returns only
//  whether they're attending and how many, from their latest reply,
//  so the invitation can say "we have you down as...". Names match
//  case-insensitively, as the guest-allowance lookup does.
// ─────────────────────────────────────────────────────────────────
function doGet(e) {
  var name = e && e.parameter && e.parameter.rsvp;
  if (!name) {
    return buildResponse({ success: true, message: 'Comments are read via CSV.' });
  }
  return buildResponse(lookupRSVP(name));
}

function lookupRSVP(name) {
  var want = String(name).trim().toLowerCase();
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(RSVP_SHEET_NAME);
  if (!want || !sheet || sheet.getLastRow() < 2) return { success: true, found: false };
  // Columns: Timestamp, Name, Attending, Total Guests, ...
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {   // newest last, so search upwards
    if (String(rows[i][1]).trim().toLowerCase() === want) {
      return {
        success:   true,
        found:     true,
        attending: String(rows[i][2]) === 'Yes' ? 'Yes' : 'No',
        total:     Number(rows[i][3]) || 1
      };
    }
  }
  return { success: true, found: false };
}


function saveRSVP(data) {
  // A guest who has replied before is confirming (or changing) their reply:
  // check before this row is added, so it doesn't find itself
  var confirmed = data.name && lookupRSVP(data.name).found ? 'Confirmed' : '';
  var sheet = getOrCreateSheet(RSVP_SHEET_NAME, [
    'Timestamp', 'Name', 'Attending', 'Total Guests', 'Note to Host', 'Dietary Requirements', 'Phone', 'Confirmed'
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name      || '',
    data.attending || '',
    data.total     || '',
    data.note      || '',
    data.dietary   || '',
    data.phone     || '',
    confirmed            // new columns go last, so existing columns don't move
  ]);
}

function saveComment(data) {
  var sheet = getOrCreateSheet(COMMENTS_SHEET_NAME, ['Timestamp', 'Name', 'Comment']);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name      || '',
    data.comment   || ''
  ]);
}

function getOrCreateSheet(name, headers) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function testLookup() {
  Logger.log(JSON.stringify(lookupRSVP('Test Guest')));
}

function testWrite() {
  saveComment({ timestamp: new Date().toISOString(), comment: 'Test from testWrite()' });
  Logger.log('Done — check your Sheet.');
}
