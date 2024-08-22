import { Text, View } from "react-native";
import strings from "./Strings";

export default function MatchPredictsSummaryPanel({predicts}) {
    function getPredictPercent(numPredicts) {
        const percent = numPredicts / predicts.numPredicts * 100
        if (percent <= 0) return "" 
        return ` (${Number.parseInt(percent)}%)`
    }

    return (
        <View>
            <Text style={{
              color: '#8E8E93',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 4
            }}>{strings.summary} ({predicts?.numPredicts} {strings.predictions})</Text>
            <View style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 20,
              paddingLeft: 10,
              paddingRight: 10,
              height: 100,
              marginBottom: 20,
              flexDirection: 'row'
            }}>
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#8E8E93',
                  fontWeight: 'bold'
                }}>1</Text>
                {predicts ? <Text style={{
                  fontSize: 20,
                  color: 'black',
                  fontWeight: 'bold'
                }}>
                  {predicts?.numP1}{getPredictPercent(predicts?.numP1)}
                  </Text> : null }
              </View>

              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#8E8E93',
                  fontWeight: 'bold'
                }}>X</Text>
                {predicts ? <Text style={{
                  fontSize: 20,
                  color: 'black',
                  fontWeight: 'bold'
                }}>
                  {predicts?.numDraw}{getPredictPercent(predicts?.numDraw)}
                  </Text> : null }
              </View>

              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#8E8E93',
                  fontWeight: 'bold'
                }}>2</Text>
                {predicts ? <Text style={{
                  fontSize: 20,
                  color: 'black',
                  fontWeight: 'bold'
                }}>
                  {predicts?.numP2}{getPredictPercent(predicts?.numP2)}
                  </Text> : null }
              </View>
            </View>
        </View>
    )
}