// ---------------------------------------------------------------
// PASTE THIS into Extensions > Apps Script inside your Google Sheet.
// See README.md for the full setup steps.
// ---------------------------------------------------------------

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVPs");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVPs");
    sheet.appendRow(["Timestamp", "Name", "Guests", "Contact", "Message", "Code"]);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date(),
    data.name || "",
    data.guests || "",
    data.contact || "",
    data.message || "",
    data.code || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
