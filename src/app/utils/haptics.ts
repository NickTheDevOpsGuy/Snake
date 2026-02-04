export function vibrateEat() {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

export function vibrateDie() {
  if ("vibrate" in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
}
