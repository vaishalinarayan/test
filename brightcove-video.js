/**
 * @fileoverview Detects video playback events in the Brightcove player and
 * sends a CustomEvent for each of them.
 *
 * Although the player is loaded in an IFRAME, Brightcover overwrites
 * `postMessage` with their own function, so you can't post messages between
 * the parent and frame windows.
 *
 * But the script is run in the context of the parent window. So CustomEvents
 * can be dispatched and they can be received in the main window.
 *
 *@doc Brightcove Player development overview https://player.support.brightcove.com/coding-topics/overview-player-api.html
 * @doc Brightcove Player API https://docs.brightcove.com/brightcove-player/current-release/Player.html
 * @doc HTML5 media events https://html.spec.whatwg.org/#mediaevents
 */

/**
 * @private
 * Given a playback event, get other metadata related to the event,
 * then send the event's details to the parent.
 * @param {Event} event The playback event.
 * @this The Brightcove player object.
 */
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
	
	
	if (state=="timeupdate" && Math.floor(fpercentViewed / 25)*25==25&& getCookie("pstate")!="25")
		
		{
		document.cookie = "pstate=25"
		  window.parent.postMessage(eventDetail,"*");
		  console.log("***25***");
		  console.log(eventDetail)
		  console.log(fcurrentTime)
		  console.log(fpercentViewed)
		}	
	
	if (state=="timeupdate" && Math.floor(fpercentViewed / 25)*25==50&& getCookie("pstate")!="50")
		
		{
		document.cookie = "pstate=50"
		  window.parent.postMessage(eventDetail,"*");
		  console.log("***50***");
		  console.log(eventDetail)
		  console.log(fcurrentTime)
		  console.log(fpercentViewed)
		}
	if (state=="timeupdate" && Math.floor(fpercentViewed / 25)*25==75&& getCookie("pstate")!="75")
		
		{
		document.cookie = "pstate=75"
		  window.parent.postMessage(eventDetail,"*");
		  console.log(eventDetail)
		  console.log("***75***");
		  console.log(fcurrentTime)
		  console.log(fpercentViewed)
		}
	
	if (state=="ended" && getCookie("pstate")!="ended")
		
		{
		document.cookie = "pstate=ended"
		  window.parent.postMessage(eventDetail,"*");
		  console.log(eventDetail)
		  console.log("***ended***");
		  console.log(fcurrentTime)
		  console.log(fpercentViewed)
		}
	
	function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length);
		}
	  }
	  return "";
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
          'ended',
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
document.cookie = "pstate="
console.log("***Start pm-tu_all state**");
handleBrightcovePlayers(1);
