import * as React from "react"
import { observer, inject } from "mobx-react"
import { ViewStyle, View, FlatList, TextStyle, Alert, TouchableOpacity } from "react-native"
import { RadioButtons } from "react-native-radio-buttons"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { QuestionStore } from "../../models/question-store"
import { Button } from "../../components/button"
import { Question } from "../../models/question"

export interface QuestionScreenProps extends NavigationScreenProps<{}> {
  questionStore: QuestionStore
}

export interface QuestionScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.medium,
  backgroundColor: color.palette.angry,
  marginTop: spacing.medium,
}

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
}

@inject("questionStore")
@observer
export class QuestionScreen extends React.Component<QuestionScreenProps, QuestionScreenState> {
  state = {
    refreshing: false,
  }

  componentDidMount() {
    this.fetchQuestions()
  }

  fetchQuestions = () => {
    this.setState({ refreshing: true })
    this.props.questionStore.getQuestions()
    this.setState({ refreshing: false })
  }

  onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}
    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={answer} />
      </TouchableOpacity>
    )
  }

  renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
        <RadioButtons
          options={question.allAnswers}
          onSelection={guess => this.onPressAnswer(question, guess)}
          selectedOption={question.guess}
          renderOption={this.renderAnswer}
        />
        <Button
          style={CHECK_ANSWER}
          onPress={() => this.checkAnswer(question)}
          text={"Check Answer!"}
        />
      </View>
    )
  }

  render() {
    const { questionStore } = this.props
    const { questions } = questionStore

    return (
      <Screen style={ROOT} preset="fixed">
        <View style={HEADER_CONTAINER}>
          <Text preset="header" tx="questionScreen.header" />
        </View>
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={this.renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
          onRefresh={this.fetchQuestions}
          refreshing={this.state.refreshing}
        />
      </Screen>
    )
  }
}
