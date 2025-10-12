function cartesian_to_hex(in_x, in_y) {
  let x = in_x - width / 2;
  let y = in_y - height / 2;
  let q_fractional = (2/3 * x) / CONFIG.circumradius;
  let r_fractional = (-1/3 * x + sqrt(3)/3 * y) / CONFIG.circumradius;
  let s_fractional = -q_fractional - r_fractional;
  let q_rounded = round(q_fractional);
  let r_rounded = round(r_fractional);
  let s_rounded = round(s_fractional);
  let q_diff = abs(q_rounded - q_fractional);
  let r_diff = abs(r_rounded - r_fractional);
  let s_diff = abs(s_rounded - s_fractional);
  if (q_diff > r_diff && q_diff > s_diff) {
    q_rounded = -r_rounded - s_rounded;
  } else if (r_diff > q_diff && r_diff > s_diff) {
    r_rounded = -q_rounded - s_rounded;
  }
  return [q_rounded, r_rounded];
}

function neighbors(q1, y1, q2, y2) {
  if (q1 == q2 && abs(y1 - y2) < 2) {return true;}
  if (abs(q1 - q2) > 1) {return false;}
  if (y1 == y2) {return true;}
  if ((q1 == 3 && y1-y2==1) || (q2 == 3 && y2-y1==1)) {return true;}
  if (q1 < 3 && ((q1 > q2 && y1 - y2 == -1) || (q2 > q1 && y2 - y1 == -1))) {return true;}
  if (q1 > 3 && ((q2 > q1 && y2 - y1 == -1) || (q1 > q2 && y1 - y2 == -1))) {return true;}
  return false;
}