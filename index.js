<script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></script>

var videoElement;
var player;
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;

window.addEventListener('load', function(event) {
    videoElement = document.getElementById('video-element');

    player = new YT.Player('video-element', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    initializeIMA();
});

function onPlayerReady(event) {
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !adsLoaded) {
        loadAds();
    }
}

function initializeIMA() {
    console.log("initializing IMA");
    adContainer = document.getElementById('ad-container');
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    videoElement.addEventListener('ended', function() {
        adsLoader.contentComplete();
        player.playVideo(); 
    });

    var adsRequest = new google.ima.AdsRequest();

    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21799500428/videodeteste&description_url=https%3A%2F%2Fwww.youtube.com%2Fchannel%2FUCc7uPJ8w_CAlGZK5DcXaBqQ&tfcd=0&npa=0&sz=400x300%7C640x480&ciu_szs=300x250&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=';

    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoElement);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdLoaded);
}

function onAdError(adErrorEvent) {
    console.log(adErrorEvent.getError());
    if(adsManager) {
        adsManager.destroy();
    }
}

function onContentPauseRequested() {
    player.pauseVideo();
}

function onContentResumeRequested() {
    player.playVideo();
    document.getElementById('ad-container').style.display = 'none';
}

function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
        player.playVideo();
    }
}

function loadAds() {
    if(adsLoaded) {
        return;
    }
    adsLoaded = true;

    console.log("loading ads");
    adDisplayContainer.initialize();

    var width = videoElement.clientWidth;
    var height = videoElement.clientHeight;
    try {
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {
        console.log("AdsManager could not be started");
        player.playVideo();
    }
}
<script src="https://www.youtube.com/iframe_api"></script>