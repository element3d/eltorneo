import { Image, View } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import dataManager from "./DataManager"
import { useState } from "react"

export default function PlayerImage({ team, player, imageSize }) {
    const [fallback, setFallback] = useState(false)
 
    function onImgError() {
        setFallback(true)
    }

    return fallback ? <View style={{
        width: imageSize,
        height: imageSize,
        alignItems: 'center',
        justifyContent: 'center',
    }}><Image
        src={`${SERVER_BASE_URL}/data/teams/150x150/${team.name.replace(/ö/g, 'o')}_kit.png${dataManager.getImageCacheTime()}`}
        style={{
            width: '130%',
            height: '130%',
            objectFit: 'scale-down',
            // backgroundColor: 'red'
            // objectFit: hasKit(match) ? 'cover' : 'contain'
        }}
    ></Image></View>
        : <Image src={`${SERVER_BASE_URL}/data/players/${team.id}/${player.apiId}.png${dataManager.getImageCacheTime()}`} style={{
            width: imageSize,
            height: imageSize,
            // backgroundColor: 'red',
            objectFit: 'contain'
        }} onError={onImgError} />
}