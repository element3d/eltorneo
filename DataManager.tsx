// import adsManager from "./AdsManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SERVER_BASE_URL from "./AppConfig";
import strings from "./Strings";

class DataManager {
    constructor() {
        this.leagues = []
        this.firstSeasonStartYear = 2024
        this.getTableByPoints()
    }

    init() {

        return fetch(`${SERVER_BASE_URL}/api/v1/settings`, {
            method: 'GET',
            // headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                this.settings = data[0]
                this.settings.blockForAd = false
                
                return this.settings

                // AsyncStorage.getItem("lastAdTime")
                // .then((time)=>{
                //     let lastAdTime;
                //     if (time) {
                //         lastAdTime = new Date(parseInt(time)); 
                //         const adDiffHours = 0//this.settings.adDiffHours
                //         const currentTime = new Date();
                //         const diffInMillis = currentTime - lastAdTime;
                //         const diffInHours = diffInMillis / 3600000; // Convert milliseconds to hours
                //         console.log(diffInHours)
                //         if (diffInHours > adDiffHours) {
                //             console.log(diffInHours)
                //             console.log("BLOCK FOR AD =========================")
                //             this.settings.blockForAd = true
                //             AsyncStorage.setItem("lastAdTime", currentTime.getTime().toString())
                //         } else {
                //             this.settings.blockForAd = false
                //         }
                        
                //     } else {
                //         lastAdTime = new Date(Date.now() - 3600000); 
                //         AsyncStorage.setItem("lastAdTime", lastAdTime.getTime().toString())
                //         this.settings.blockForAd = false
                //     }
                // })

                // adsManager.init()
            })
            .catch(error => { 
                
                console.error('Error fetching settings:', error)
                throw "Error"
            });
    }

    setMatch(m) {
        if (m.predict &&  (m.predict.team1_score < 0 || m.predict.team2_score < 0)) m.predict = null
        this.match = m
    }

    getMatch() {
        return this.match
    }

    checkBlockForAd() {
        if (!this.settings.enableAds) return

        return AsyncStorage.getItem("lastAdTime")
        .then((time)=>{
            let lastAdTime;
            if (time) {
                lastAdTime = new Date(parseInt(time)); 
                const adDiffHours = this.settings.adDiffHours
                const currentTime = new Date();
                const diffInMillis = currentTime - lastAdTime;
                const diffInHours = diffInMillis / 3600000; 
                if (diffInHours > adDiffHours) {
                    this.settings.blockForAd = true
                    // AsyncStorage.setItem("lastAdTime", currentTime.getTime().toString())
                } else {
                    this.settings.blockForAd = false
                }
                
            } else {
                lastAdTime = new Date(Date.now() - 3600000); 
                AsyncStorage.setItem("lastAdTime", lastAdTime.getTime().toString())
                this.settings.blockForAd = false
            }

            return this.settings
        })
    }

    getWeekTitle(week) {
        if (week.type == 0) {
          return `${strings.matchday} ${week.week}`
        } else if (week.type == 1) {
          return 'Round of 16'
        } else if (week.type == 2) {
          return 'Quarter final'
        } else if (week.type == 3) {
          return 'Semi final'
        } else if (week.type == 4) {
          return 'Final'
        }
      }

    getSettings() {
        return this.settings
    }

    setLeagues(leagues) {
        this.leagues = leagues
    }

    getLeagues() {
        return this.leagues
    }

    getSeasons() {
        const seasons = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        const seasonCutoff = new Date(currentYear, 7, 1); // August 1st of the current year (month is 0-indexed)

        // Determine the correct year to use as the current season's start year
        const effectiveYear = today >= seasonCutoff ? currentYear : currentYear - 1;

        for (let i = this.firstSeasonStartYear; i <= effectiveYear; ++i) {
            let nextYearShort = (i + 1) % 100; // Get the last two digits of the next year
            seasons.push(`${i}/${nextYearShort.toString().padStart(2, '0')}`); // Format as "YYYY/YY"
        }
        return seasons;
    }

    getTable() {
        return this.table
    }

    getPredictTitle(p) {
        if (p.status == 0) return strings.prediction
        if (p.status == 1) { 
            if (p.team1_score == p.team2_score) return strings.draw_predicted
            return strings.winner_predicted
        }
        if (p.status == 2) return strings.score_predicted
        if (p.status == 3) return strings.prediction_was_failed
    }

    findUserPosition(userId) {
        // Loop through the array of users
        for (let i = 0; i < this.table.length; i++) {
            // Check if the current user's id matches the provided userId
            if (this.table[i].id === userId) {
                // Return the 1-based index
                return i + 1;
            }
        }
        // Return -1 if no matching user is found
        return -1;
    }

    getTableByPoints() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(`${SERVER_BASE_URL}/api/v1/table/points`, requestOptions)
            .then(response => {
                if (response.status == 200)
                    return response.json()
                return null
            })
            .then(data => {
                this.table = data
            })
            .catch(() => {

            });
    }

    setPendingPredict(p) {
        this.pendingPredict = p
    }

    getPendingPredict() {
        return this.pendingPredict
    }

    getLangs() {
        if (this.langs) return this.langs;
        
        this.langs =  {
            "en": "English",
            "es": "Español",
            "ru": "Русский",
            "fr": "Français",
            "it": "Italiano",
            "pt": "Português",
            "de": "Deutsch",
            "hr": "Hrvatski",
        }
        return this.langs;
    }

    getTestTop20Predicts() {
        return [
            {
                user: {
                    name: "Lukas Müller",
                    avatar: "",
                    points: 438,
                    position: 1,
                },
                team1_score: 2,
                team2_score: 0,
                status: 1
            },
            {
                user: {
                    name: "Mateo Rossi",
                    avatar: "",
                    points: 218,
                    position: 2,
                },
                team1_score: 3,
                team2_score: 1,
                status: 1
            },
            {
                user: {
                    name: "Filip Kovacs",
                    avatar: "",
                    points: 124,
                    position: 4,
                },
                team1_score: 1,
                team2_score: 1,
                status: 3
            },
            {
                user: {
                    name: "",
                    avatar: "",
                    points: 438,
                    position: 1,
                },
                team1_score: 2,
                team2_score: 0,
                status: 1
            }
        ]
    }
    
    getTestTable() {
        return [
            {
                name: "Lukas Müller",
                avatar: "",
                predictions: 438,
                totalPredictions: 368,
            },
            {
                name: "Mateo Rossi",
                avatar: "",
                predictions: 218,
                totalPredictions: 437,
            },
            {
                name: "Sebastian Novak",
                avatar: "",
                predictions: 243,
                totalPredictions: 387,
            },
            {
                name: "Filip Kovacs",
                avatar: "",
                predictions: 218,
                totalPredictions: 320,
            },
            {
                name: "Olivier Dupont",
                avatar: "",
                predictions: 175,
                totalPredictions: 279,
            },
            {
                name: "Jan Kowalski",
                avatar: "",
                predictions: 143,
                totalPredictions: 320,
            }
            ,{
                name: "Nikolai Petrov",
                avatar: "",
                predictions: 113,
                totalPredictions: 227,
            }
            ,{
                name: "Erik Johansson",
                avatar: "",
                predictions: 78,
                totalPredictions: 147,
            }
            ,{
                name: "Mariusz Nowak",
                avatar: "",
                predictions: 57,
                totalPredictions: 89,
            },
            {
                name: "Mariusz Nowak",
                avatar: "",
                predictions: 56,
                totalPredictions: 368,
            }
        ]
    }
}

const dataManager = new DataManager()
export default dataManager