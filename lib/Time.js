export default class Time {
  static getTimeFromSeconds(miliSecs) {
    const totalSeconds = Math.ceil(miliSecs/1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const fooltSec = miliSecs / 1000
    const tmp = fooltSec - Math.trunc(miliSecs / 1000)
    const tmp2 = tmp.toFixed(2)
    let seconds100 =  (tmp2 * 100) === 100 ? 0 : (tmp2 * 100)
    seconds100 = Math.trunc(seconds100)
    return {
      seconds100,
      seconds,
      minutes,
      hours,
      days,
    };
  }

  static getSecondsFromExpiry(expiry, shouldRound) {
    const now = new Date().getTime();
    const milliSecondsDistance = expiry - now;
    return milliSecondsDistance > 0 ? milliSecondsDistance : 0;
  }

  static getSecondsFromPrevTime(prevTime, shouldRound) {
    const now = new Date().getTime();
    const milliSecondsDistance = now - prevTime;
    return milliSecondsDistance > 0 ? milliSecondsDistance : 0;
  }
}
