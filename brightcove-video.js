function handlePlaybackEvent_(event) {
  var state = event.type;
  var player = this;

  var eventDetail = {
    currentTime: player.currentTime(),
    duration: player.duration(),
    name: player.mediainfo.name,
    state: state,
  };
  var eventInit = {
    detail: eventDetail,
  };

  console.log('Player is available');
  var customEvent = new CustomEvent(state, eventInit);
  console.log(customEvent);
  window.aa = customEvent;
  console.log("file 2");
  player.dispatchEvent(customEvent);

}

function handleBrightcovePlayers(numTries) {
  var players = videojs.getPlayers();
  var playerIds = Object.keys(players);
  if (playerIds.length === 0) {
    // players are not ready, try again
    // give up after about 7.5 seconds
    if (numTries < 10) {
      // use exponential backoff to delay
      setTimeout(function() {
        var numTries = numTries * 2;
        handleBrightcovePlayers(numTries);
      }, numTries * 500);
    }
  } else {
    try {
      videojs.getPlayer('J5eBQvT9f').ready(function() {
        var player = this;
        var playerEvents = [
          'ended',
          'pause',
          'play',
        ];
        playerEvents.forEach(function(playerEvent) {
			console.log(playerEvent);
		  console.log("playerEvent");
          player.on(playerEvent, handlePlaybackEvent_);
        });
      });
    } catch (e) {
      console.warn(e);
    }
  }
}
console.log("**Start1 **")
handleBrightcovePlayers(1);
