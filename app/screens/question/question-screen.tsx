import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { RadioButtons } from "react-native-radio-buttons"
import { Screen, Text, Button } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models/root-store/root-store-context"
import { Question } from "../../models/question/question"
import { decodeHTMLEntities } from "../../utils/html-decode"

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.background,
  paddingHorizontal: spacing.large,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.huge,
  marginBottom: spacing.medium,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.smaller,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.smaller,
  backgroundColor: color.palette.angry,
  marginTop: spacing.smaller,
}

export const QuestionScreen = observer(function QuestionScreen() {
  // Are we refreshing the data
  const [refreshing, setRefreshing] = useState(false)

  // Pull in one of our MST stores
  const { questionStore } = useStores()
  const { questions } = questionStore

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}
    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={decodeHTMLEntities(answer)} />
      </TouchableOpacity>
    )
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={decodeHTMLEntities(question.question)} />
        <RadioButtons
          options={question.allAnswers}
          onSelection={(guess) => onPressAnswer(question, guess)}
          selectedOption={question.guess}
          renderOption={renderAnswer}
        />
        <Button style={CHECK_ANSWER} onPress={() => checkAnswer(question)} text={"Check Answer!"} />
      </View>
    )
  }
  return (
    <Screen style={ROOT} preset="fixed">
      <View style={HEADER_CONTAINER}>
        <Text preset="header" tx="questionScreen.header" />
      </View>
      <FlatList
        style={QUESTION_LIST}
        data={questionStore.questions}
        renderItem={renderQuestion}
        extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
        keyExtractor={(item) => item.id}
        onRefresh={fetchQuestions}
        refreshing={refreshing}
      />
    </Screen>
  )
})
