import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center"
  },
  timerText: {
    fontSize: 90,
    color: "#FFF"
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  picker: {
    width: 50,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10
      }
    })
  },
  pickerItem: {
    color: "#FFF",
    fontSize: 20
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
});

const createArray = length => {
  const arr = [];
  let i = -1;
  while (i++ < length) arr.push(i.toString());
  return arr;
};

const AVAILABLE_MINUTES = createArray(30);
const AVAILABLE_SECONDS = createArray(60);

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

export default function App() {
  const [remainingSeconds, remainingSecondsSet] = React.useState(5);
  const [selectedMin, selectedMinSet] = React.useState("0");
  const [selectedSecs, selectedSecsSet] = React.useState("5");
  React.useEffect(() => {
    remainingSecondsSet(parseInt(selectedMin) * 60 + parseInt(selectedSecs));
  }, [selectedMin, selectedSecs]);
  const [isRunning, isRunningSet] = React.useState(false);
  const [debug, debugSet] = React.useState("");

  const { minutes, seconds } = getRemaining(remainingSeconds);

  const interval = React.useRef(null);
  React.useEffect(
    () => () => interval.current && clearInterval(interval.current),
    []
  );

  const stop = () => {
    clearInterval(interval.current);
    interval.current = null;
    isRunningSet(false);
    return remainingSeconds;
  };

  const start = () => {
    if (interval.current) return remainingSecondsSet(stop());
    isRunningSet(true);
    interval.current = setInterval(
      () =>
        remainingSecondsSet(s => {
          if (s) return s - 1;
          return stop();
        }),
      1000
    );
  };

  const renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Text style={{ color: "#fff" }}>{debug}</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedMin}
          onValueChange={itemValue => selectedMinSet(itemValue)}
          mode="dropdown"
        >
          {AVAILABLE_MINUTES.map(min => (
            <Picker.Item key={min} label={min} value={min} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedSecs}
          onValueChange={itemValue => selectedSecsSet(itemValue)}
          mode="dropdown"
        >
          {AVAILABLE_SECONDS.map(min => (
            <Picker.Item key={min} label={min} value={min} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <Text style={styles.timerText}>
          {minutes}:{seconds}
        </Text>
      ) : (
        renderPickers()
      )}
      <TouchableOpacity
        onPress={start}
        style={isRunning ? [styles.button, styles.buttonStop] : styles.button}
      >
        <Text
          style={
            isRunning
              ? [styles.buttonText, styles.buttonTextStop]
              : styles.buttonText
          }
        >
          {isRunning ? "Stop" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
