const { Clutter, St } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

let text, button, sourceId = null;

// Check if current year is Leap Year (Gregorian Leap Rule)
// Uses optimized version from: https://stackoverflow.com/a/11595914

function leapYear( year ) {
  return ( year & 3 ) === 0 && ( ( year % 25 ) !== 0 || ( year & 15 ) === 0 );
}

function _getNanakshahiDate() {

  // Taken from:
  // https://github.com/sarabveer/nanakshahi-js/blob/fc9b49ca67d1947fa3fba74c7cddf39535698326/lib/getNanakshahiDate.js

  months = ['Chet', 'Vaisakh', 'Jeth', 'Harh', 'Savan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun'];

  // NS Month Offsets
  monthOffsets = [ 14, 14, 15, 15, 16, 16, 15, 15, 14, 14, 13, 12 ];

  // Current Date
  gregorianDate = new Date();
  year = gregorianDate.getFullYear();

  // Calculate Nanakshahi Year - March 14 (1 Chet) Nanakshahi New Year
  nsYear = gregorianDate >= new Date( year, 2, 14 )
    ? year - 1468
    : year - 1469;

  // Calculate Nanakshahi Date
  nsMonth = ( gregorianDate.getMonth() + 9 ) % 12;
  nsNextMonth = ( nsMonth + 1 ) % 12;

  if ( gregorianDate.getDate() >= monthOffsets[ nsNextMonth ] ) {
    nsMonth = nsNextMonth;
    nsDate = gregorianDate.getDate() - monthOffsets[ nsNextMonth ] + 1;
  } else {
    gregorianMonths = [
      31,
      leapYear( year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    nsDate = gregorianMonths[ ( gregorianDate.getMonth() + 11 ) % 12 ]
      - monthOffsets[ nsMonth ] + gregorianDate.getDate() + 1;
  }

  date = "|          " + nsDate + " " + months[ nsMonth ] + ", " + nsYear + " N.S.";
  text = new St.Label({
    style_class: 'nanakshahi-label',
    y_expand: true,
    y_align: Clutter.ActorAlign.CENTER,
    text: date
  });
  button.set_child(text);
  sourceId = Mainloop.timeout_add_seconds(1, _getNanakshahDate);
}

function init() { }

function enable() {
  button = new St.Bin({
    style_class: 'panel-button',
    reactive: true,
    can_focus: true,
    x_expand: true,
    y_expand: false,
    track_hover: false
  });

  _getNanakshahiDate();

  Main.panel._centerBox.insert_child_at_index(button, -1);
}

function disable() {
  Main.panel._centerBox.remove_child(button);
  if (button) {
    button.destroy();
    buttton = null;
  }
  if (sourceId) {
    Mainloop.source_remove(sourceId);
    sourceId = null;
  }
}
