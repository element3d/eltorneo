import { RewardedAd, TestIds, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import dataManager from './DataManager';

// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-7041403371220271/3023099910';
// const adUnitId = 'ca-app-pub-7041403371220271/3023099910';


class AdsManager {
    contructor() {
       
    }

    isLoaded() {
        return this.loaded
    }

    setIsLoaded(l) {
        this.loaded = l
    }

    init() {
        dataManager.init()
        .then(()=>{
            const adUnitId = dataManager.getSettings().prodAds ? 'ca-app-pub-7041403371220271/3023099910' : TestIds.REWARDED

            this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
                requestNonPersonalizedAdsOnly: true,
            });
    
            this.loaded = false
            this.onLoad = null
            this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, ()=>{
                this.loaded = true
                if (this.onLoad) this.onLoad()
            });
    
        })
    }

    loadAd() {
        this.rewardedAd.load()
    }

    showAd() {
        this.rewardedAd.show()
    }
   
    addErrorListener(listener) {
        return this.rewardedAd.addAdEventListener(AdEventType.ERROR, listener);
    }

    addLoadedListener(listener) {
        return this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, listener);
    }

    addSuccessListener(listener) {
        return this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, listener);
    }

    addCloseListener(listener) {
        return this.rewardedAd.addAdEventListener(AdEventType.CLOSED, listener);
    }
}

const adsManager = new AdsManager()
export default adsManager