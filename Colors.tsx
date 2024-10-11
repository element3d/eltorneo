import AsyncStorage from "@react-native-async-storage/async-storage"

class ColorsClass {
    // constructor() {
    //     this.bgColor = "#1C1C1E"
    //     this.gray800 = "#2C2C2E"
    //     this.titleColor = "#FFFFFF"
    //     this.borderColor = "#38384C"
    //     this.chipText = "#8E8E93"
    // }
    

    getBgColor() {
        return this.bgColor
    }

    constructor() {
        this.mode = 1

        this.bgColor = "#f7f7f7"
        this.gray800 = "#ffffff"
        this.titleColor = "#1C1C1E"
        this.borderColor = "#EAEDF1"
        this.chipText = "#8E8E93"
        this.statusBar = "dark-content"
        this.bottomNavBarColor = "#ffffff"
        this.selectColor = "#F0F0F0"
        this.statLine = "#EAEDF1",
        this.lineupName = '#3A3A3C'
    }

    setNewMode(m) {
        if (m == 2) {
            this.mode = 2
            this.bgColor = "#111111"//"#1C1C1E"
            this.gray800 = "#181818"//"#2C2C2E"
            this.titleColor = "#FFFFFF"
            this.borderColor = "#38384C"
            this.chipText = "#8E8E93"
            this.statusBar = "light-content"
            this.bottomNavBarColor = "#181818"
            this.selectColor = "#141414"
            this.statLine = "#181818"
            this.lineupName = '#D1D1D6'
        } else {
            this.mode = 1

            this.bgColor = "#f7f7f7"
            this.gray800 = "#ffffff"
            this.titleColor = "#1C1C1E"
            this.borderColor = "#EAEDF1"
            this.chipText = "#8E8E93"
            this.statusBar = "dark-content"
            this.bottomNavBarColor = "#ffffff"
            this.selectColor = "#F0F0F0"
            this.statLine = "#EAEDF1",
            this.lineupName = '#3A3A3C'
        }

        AsyncStorage.setItem('mode', this.mode.toString())
    }

    swap() {
        if (this.mode == 1) {
            this.mode = 2
            this.bgColor = "#111111"//"#1C1C1E"
            this.gray800 = "#181818"//"#2C2C2E"
            this.titleColor = "#FFFFFF"
            this.borderColor = "#38384C"
            this.chipText = "#8E8E93"
            this.statusBar = "light-content"
            this.bottomNavBarColor = "#181818"
            this.selectColor = "#141414"
            this.statLine = "#181818"
            this.lineupName = '#D1D1D6'
        } else {
            this.mode = 1

            this.bgColor = "#f7f7f7"
            this.gray800 = "#ffffff"
            this.titleColor = "#1C1C1E"
            this.borderColor = "#EAEDF1"
            this.chipText = "#8E8E93"
            this.statusBar = "dark-content"
            this.bottomNavBarColor = "#ffffff"
            this.selectColor = "#F0F0F0"
            this.statLine = "#EAEDF1",
            this.lineupName = '#3A3A3C'
        }

        AsyncStorage.setItem('mode', this.mode.toString())
    }
}

const Colors = new ColorsClass()
export default Colors