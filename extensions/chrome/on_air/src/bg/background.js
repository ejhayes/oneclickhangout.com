// redirect to a new hangout window
function copyToClipboard( text ){
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var hangoutBaseUrl = "https://plus.google.com/hangouts/_/?hl=en&hcb=0&htt=My%20On%20Air%20Hangout&lm1=1&hscid=&hso=0";

    chrome.tabs.create({ url: hangoutBaseUrl }, function(tab){
      // when the tab is created we are waiting to get a
      // valid hangout url, which may require the user to
      // login, so we will keep checking and waiting until
      // the url looks correct
      var checkForValidHangout = function(sleepDuration, processHangoutCallback){
        var validHangoutRegex = /^https:\/\/plus.google.com\/hangouts\/_\/[^\?]+.+/;
        chrome.tabs.get(tab.id, function(tab){
          setTimeout(function(){
            if( validHangoutRegex.test(tab.url) ){
              // valid hangout encountered, finally
              processHangoutCallback(tab.url);
            } else {
              console.log("waiting another second for a valid hangout...");
              checkForValidHangout(sleepDuration, processHangoutCallback); // wait again
            }
          }, sleepDuration);
        });
      };
      
      // once the hangout is valid, do some useful stuff
      checkForValidHangout(1000, function(hangout_url){
        // prepare notification
        var opt = {
          type: "basic",
          title: "On-Air Hangout Created",
          message: "The hangout url is: " + hangout_url + ". Copying to clipboard.",
          iconUrl: "icons/hangout48.png"
        };
        var notificationId = "google_onair_hangout_notification";

        // copy link to clipboard
        copyToClipboard(hangout_url);

        // send the notification
        chrome.notifications.create(notificationId, opt, function(notificationId){
          setTimeout(function(){
            chrome.notifications.clear(notificationId, function(){
              console.log("cleared: " + notificationId);
            });
          }, 3000);
        });
      });
      
    });
});