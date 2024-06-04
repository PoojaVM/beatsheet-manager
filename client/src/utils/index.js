export const attachStartAndEndTimesToBeats = (beatSheet) => {
    let currentTime = 0;
    beatSheet.acts.forEach((act) => {
      act.beats.forEach((beat) => {
        beat.startTime = currentTime;
        currentTime += beat.duration;
        beat.endTime = currentTime;
      });
    });
  
    return beatSheet;
};