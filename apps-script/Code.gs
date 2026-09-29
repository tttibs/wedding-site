// ─────────────────────────────────────────────────────────────────
//  Save The Date — Google Apps Script Backend  (v7 — final)
//
//  Reading comments is now handled by Google Sheets CSV export
//  directly in the browser — no doGet needed.
//  This script only handles WRITING (RSVP + comments via POST).
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
//  GET — kept minimal; reading is done via CSV in the browser
// ─────────────────────────────────────────────────────────────────
function doGet(e) {
  return buildResponse({ success: true, message: 'Write-only endpoint. Comments are read via CSV.' });
}


function saveRSVP(data) {
  var sheet = getOrCreateSheet(RSVP_SHEET_NAME, [
    'Timestamp', 'Name', 'Attending', 'Total Guests', 'Note to Host'
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name      || '',
    data.attending || '',
    data.total     || '',
    data.note      || ''
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

function testWrite() {
  saveComment({ timestamp: new Date().toISOString(), comment: 'Test from testWrite()' });
  Logger.log('Done — check your Sheet.');
}
