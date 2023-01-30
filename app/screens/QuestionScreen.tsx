import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Alert, FlatList, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Button, Text } from "../components"
import { spacing, colors } from "../theme"
import { Question, useStores } from "../models"
import { decodeHTMLEntities } from "../utils/decode-html"
import { TouchableOpacity } from "react-native-gesture-handler"
import { RadioButtons } from "react-native-radio-buttons"

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const QuestionScreen: FC<StackScreenProps<AppStackScreenProps, "Question">> = observer(
  function QuestionScreen() {
    // Are we refreshing the data?
    const [refreshing, setRefreshing] = React.useState(false)

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
        Alert.alert("Correct!")
      } else {
        Alert.alert(`Wrong! The correct answer is ${question.correctAnswer}`)
      }
    }

    const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
      const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 18 } : {}
      return (
        <TouchableOpacity key={index} onPress={onSelect} style={$answerWrapper}>
          <Text style={[$answer, style]} text={decodeHTMLEntities(answer)} />
        </TouchableOpacity>
      )
    }

    const renderQuestion = ({ item }) => {
      const question: Question = item
      if (question.allAnswers.length === 0) {
        question.setAllAnswers()
      }
      return (
        <View style={$questionWrapper}>
          <Text style={$question} text={decodeHTMLEntities(question.question)} />
          <RadioButtons
            options={question.allAnswers}
            onSelection={(guess) => onPressAnswer(question, guess)}
            selectedOption={question.guess}
            renderOption={renderAnswer}
          />
          <Button style={$checkAnswer} onPress={() => checkAnswer(question)} text="Check Answer!" />
        </View>
      )
    }

    return (
      <Screen style={$root} preset="fixed">
        <Text preset="heading" tx={"questionScreen.header"} style={$header} />
        <FlatList
          style={$questionList}
          data={questions}
          renderItem={renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={(item) => item.id}
          onRefresh={fetchQuestions}
          refreshing={refreshing}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.large,
}

const $header: TextStyle = {
  marginTop: spacing.huge,
  marginBottom: spacing.medium,
}

const $questionList: ViewStyle = {
  marginBottom: spacing.large,
}

const $questionWrapper: ViewStyle = {
  borderBottomColor: colors.border,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const $question: TextStyle = {
  fontWeight: "bold",
  fontSize: spacing.medium,
  marginVertical: spacing.medium,
}

const $answer: TextStyle = {
  fontSize: spacing.small,
}

const $answerWrapper: ViewStyle = {
  paddingVertical: spacing.extraSmall,
}

const $checkAnswer: ViewStyle = {
  paddingVertical: spacing.extraSmall,
  backgroundColor: colors.error,
  marginTop: spacing.extraSmall,
  borderColor: colors.error,
}
