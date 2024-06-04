export const attachStartAndEndTimesToBeats = (beatSheet) => {
    let currentTime = 0;
    beatSheet.acts.forEach((act) => {
      act.beats.forEach((beat) => {
        beat.startTime = currentTime;
        currentTime += beat.duration;
        beat.endTime = currentTime;
      });
    });

    beatSheet.acts.forEach((act) => {
      act.beats.forEach((beat) => {
        beat.startTime =
          Math.floor(beat.startTime / 60) + "m " + (beat.startTime % 60) + "sec";
        beat.endTime =
          Math.floor(beat.endTime / 60) + "m " + (beat.endTime % 60) + "sec";
      });
    });
  
    return beatSheet;
};