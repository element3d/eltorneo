import { RewardedAd, TestIds, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import dataManager from './DataManager';

// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-7041403371220271/3023099910';
// const adUnitId = 'ca-app-pub-7041403371220271/3023099910';


class AdsManager {
    contructor() {
        this.isInitialized = false
    }

    isLoaded() {
        return this.loaded
    }

    setIsLoaded(l) {
        this.loaded = l
    }

    init() {
        return dataManager.init()
        .then((settings)=>{
            if (!settings) return
            this.isInitialized = true
            if (!settings.enableAds) return
            
            const adUnitId = dataManager.getSettings().prodAds ? 'ca-app-pub-7041403371220271/3023099910' : TestIds.REWARDED

            this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
                requestNonPersonalizedAdsOnly: true,
            });
    
            this.loaded = false
            this.onLoad = null
            this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, ()=>{
                this.loaded = true
                this.isLoading = false
                if (this.onLoad) this.onLoad()
            });

            this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, ()=>{
                this.rewarded = true
            });

            this.rewardedAd.addAdEventListener(AdEventType.ERROR, (e)=>{
                this.loaded = false
                this.isLoading = false
                dataManager.getSettings().enableAds = false
                dataManager.getSettings().blockForAd = false
            });

            const pr = dataManager.checkBlockForAd()
            if (pr) pr
                .then((settings)=>{
                    if (settings.blockForAd) {
                        this.loadAd()
                    }
                })
        })
    }

    loadAd() {
        if (this.isLoading) return

        this.isLoading = true
        this.rewardedAd.load()
    }

    showAd() {
        this.rewarded = false 
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

    setRewarded(rewarded) {
        this.rewarded = rewarded
    }

    getRewarded() {
        return this.rewarded
    }
}

const adsManager = new AdsManager()
export default adsManager