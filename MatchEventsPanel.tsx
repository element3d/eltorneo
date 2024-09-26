import { Text, View } from "react-native";
import GoalIcon from './assets/goal.svg'
import YellowCardIcon from './assets/yellow_card.svg'
import RedCardIcon from './assets/red_card.svg'
import VarIcon from './assets/var.svg'
import SubstIcon from './assets/subst.svg'

import strings from "./Strings";

function Item({event, index, isLast, score}) {

    function getTypeString() {
        if (event.type == 'Goal' && event.detail == "Missed Penalty") return strings.missed_penalty
        if (event.type == "Goal") return `${strings.goal} (${score})`
        if (event.type == "Card") return strings.card
        if (event.type == "Var" && event.detail == "Goal Disallowed - handball") return `Var: ${strings.handball}`
        if (event.type == "subst") return event.assist
        return event.type
    }

    function renderContent() {
        return <View style={{
            // backgroundColor: 'red',
            alignItems: event.team == 1 ? 'flex-end' : 'flex-start'
        }}>
            <Text style={{
                color: '#00C566',
                fontWeight: 'bold',
                // marginBottom: 4,
            }}>{event.elapsed}'{event.extra ? ' + ' + event.extra : null}</Text>
            <Text style={{
                color: '#1C1C1E',
                fontSize: 14,
                fontWeight: 'bold'
            }}>{  event.player}</Text>
             <Text style={{
                color: '#8E8E93',
                fontSize: 12,
                fontWeight: 'bold'
            }}>{getTypeString()}</Text>
        </View>
    }

    function getIcon() {
        if (event.type == "Goal") 
        {
            if (event.detail == "Penalty") 
            {
                return <View style={{
                    alignItems: 'center',
                    justifyContent: 'centers'
                }}>
                    <GoalIcon color={'#1C1C1E'} width={30} height={30} />
                    <Text style={{
                        marginTop: -2,
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 8
                    }}>PEN</Text>
                </View>

            }
            if (event.detail == "Missed Penalty") 
            {
                return <View style={{
                    alignItems: 'center',
                    justifyContent: 'centers'
                }}>
                    <VarIcon color={'#1C1C1E'} width={30} height={30} />
                    <Text style={{
                        marginTop: -2,
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 8
                    }}>PEN</Text>
                </View>

            }
            else if (event.detail == "Own Goal") 
            {
                return <View style={{
                    alignItems: 'center',
                    justifyContent: 'centers'
                }}>
                    <GoalIcon color={'#1C1C1E'} width={30} height={30} />
                    <Text style={{
                        marginTop: -2,
                        color: '#FF4747',
                        fontWeight: 'bold',
                        fontSize: 8
                    }}>OG</Text>
                </View>

            }
            
            return <GoalIcon color={'#1C1C1E'} width={40} height={40} />
        }
        if (event.type == "Var" && (event.detail == 'Goal cancelled' 
            || event.detail == 'Goal Disallowed - offside'
            || event.detail == 'Goal Disallowed - handball')) 
            return <VarIcon width={40} height={40} />

        if (event.detail == "Yellow Card") return <YellowCardIcon width={40} height={40} />
        if (event.detail == "Red Card") return <RedCardIcon width={40} height={40} />
        if (event.type == "subst") return <SubstIcon width={30} height={40} />

    }

    return <View style={{
        width: '100%',
        height: 100,
        // marginTop: 2,
        // backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }}>
       <View style={{
        flex: 1,
        height: '100%',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-end'
       }}>
        {event.team == 1 ? renderContent() : null}
       </View>
       <View style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
            // backgroundColor: 'red'
       }}>
        <View style={{  
            width: 2,
            flex: 1,
            backgroundColor: index == 0 ? 'transparent' : '#EAEDF1'
        }}></View> 
        <View style={{
            width: 60,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: '#EAEDF1'
        }}>
            {getIcon()}
        </View>
        <View style={{  
            width: 2,
            flex: 1,
            backgroundColor: isLast ? 'transparent' : '#EAEDF1'
        }}></View> 
       </View>
       <View style={{
        flex: 1,
        marginLeft: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start'
       }}>
        {event.team == 2 ? renderContent() : null}
       </View>
    </View>
}

export default function MatchEventsPanel({events}) {
    let t1Score = 0
    let t2Score = 0

    return <View>
        {events.map((e, i)=>{
            // if (e.type == 'subst') return null
            if (e.type == "Goal" && e.detail != "Missed Penalty") 
            {
                if (e.team == 1) t1Score++;
                else t2Score++;
            }
            const score = `${t1Score}-${t2Score}`
            return <Item key={`${i}_${e.elapsed}_${e.player}`} score={score} index={i} event={e} isLast={i == events.length - 1}></Item>
        })}
    </View>
}