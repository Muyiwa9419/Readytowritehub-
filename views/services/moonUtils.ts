
export type MoonPhase = {
  phase: number; // 0 to 1
  name: string;
  icon: string;
};

export const getMoonPhase = (date: Date): MoonPhase => {
  const lp = 2551443; 
  const now = date.getTime();
  const newMoon = new Date(1970, 0, 7, 20, 35, 0).getTime();
  const phase = ((now - newMoon) % lp) / lp;

  let name = "";
  let icon = "";

  if (phase < 0.0625 || phase >= 0.9375) {
    name = "New Moon";
    icon = "🌑";
  } else if (phase < 0.1875) {
    name = "Waxing Crescent";
    icon = "🌒";
  } else if (phase < 0.3125) {
    name = "First Quarter";
    icon = "🌓";
  } else if (phase < 0.4375) {
    name = "Waxing Gibbous";
    icon = "🌔";
  } else if (phase < 0.5625) {
    name = "Full Moon";
    icon = "🌕";
  } else if (phase < 0.6875) {
    name = "Waning Gibbous";
    icon = "🌖";
  } else if (phase < 0.8125) {
    name = "Last Quarter";
    icon = "🌗";
  } else {
    name = "Waning Crescent";
    icon = "🌘";
  }

  return { phase, name, icon };
};
