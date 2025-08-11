import { useState } from "react"
import { Image } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import dataManager from "./DataManager"

function getImageName(match) {
    if (hasKit(match)) {
        return `_kit.png${dataManager.getImageCacheTime()}`
    }
    return '.png'

}

function hasKit(match) {
    return match.league == 3 || match.league == 2 || match.league == 4 || match.league == 5 || match.league == 6 || match.league == 1 || match.league == 16
}


export default function KitImage({ width, height, match, team }) {
    const [fallback, setFallback] = useState(false)

    function onImgError() {
        setFallback(true)
    }

    return fallback ? <Image
        source={require('./assets/blank_kit.png')}
        style={{
            width: width,
            height: height,
            objectFit: hasKit(match) ? 'cover' : 'contain'
        }}></Image> : <Image
            src={`${SERVER_BASE_URL}/data/teams/150x150/${team.name.replace(/ö/g, 'o')}${getImageName(match)}`}
            style={{
                width: width,
                height: height,
                objectFit: hasKit(match) ? 'cover' : 'contain'
            }}
            onError={onImgError}></Image>
}
