// Standard Google Universal Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
 
ga('create', 'UA-48659460-2', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/hangout-chrome-background.js');

// report events
var logEvent = function(category, action, value) {
  ga('send', 'event', 'Hangout Extension - ' + category, action, value);
}

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
    var hangoutBaseUrl = "https://plus.google.com/hangouts/_?gid=";
    var accountSelectionBaseUrl = "https://www.google.com/a/SelectSession?service=oz&continue=";
    //var newURL = "https://www.google.com/";
    // https://plus.google.com/hangouts/_/7ecpiq19k22jfmg8n7puh7688s
    chrome.tabs.create({ url: accountSelectionBaseUrl + encodeURIComponent(hangoutBaseUrl) }, function(tab){
      // when the tab is created

      // we are waiting to get a valid hangout url, which may require the user
      // to login, so we will keep checking and waiting until the url looks correct
      var checkForValidHangout = function(sleepDuration, processHangoutCallback){
        var validHangoutRegex = /^https:\/\/plus.google.com\/hangouts\/_\/.+/;
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
        // we want to select our own account for the hangout url
        var use_hangout_url = accountSelectionBaseUrl + encodeURIComponent(hangout_url)

        // prepare notification
        var opt = {
          type: "basic",
          title: "Hangout Created",
          message: "The hangout url is: " + use_hangout_url + ". Copying to clipboard.",
          iconUrl: "icons/hangout48.png"
        };
        var notificationId = "google_hangout_notification";

        // copy link to clipboard
        copyToClipboard(use_hangout_url);
        logEvent('hangout', 'created', hangout_url);

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