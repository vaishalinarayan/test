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
  
  
	console.log("Player Start")
	var fcurrentTime = player.currentTime();
	var fduration = player.duration();
	var fpercentViewed = Math.floor((fcurrentTime/fduration)*100);
	var ev = this._isEventViewed;	
	console.log(ev);
	if (!this._isEventViewed.play && state=="play")
		{
		  this._isEventViewed.play=true;
		  window.parent.postMessage(eventDetail,"*");
		  console.log("***play***")
		}	
  

}

/**
 * @public
 * Send CustomEvents to the parent for specific media playback events.
 * @param {int} numTries Counter of tries to check that players are valid.
 */
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
    var playerId = playerIds[0];
    try {
      videojs.getPlayer(playerId).ready(function() {
        var player = this;
        var playerEvents = [
          'pause',
          'play',
		  'timeupdate',
        ];
        playerEvents.forEach(function(playerEvent) {
          player.on(playerEvent, handlePlaybackEvent_);
        });
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

console.log("***Start window.parent pm-tu_Play 2**");
handleBrightcovePlayers(1);
