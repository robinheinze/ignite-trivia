import * as React from "react"
import { observer, inject } from "mobx-react"
import { ViewStyle, View, FlatList, TextStyle, Alert } from "react-native"
import RadioForm from "react-native-simple-radio-button"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { QuestionStore } from "../../models/question-store"
import { Button } from "../../components/button"
import { Question } from "../../models/question"
import { palette } from "../../theme/palette"

export interface QuestionScreenProps extends NavigationScreenProps<{}> {
  questionStore: QuestionStore
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginVertical: spacing.extraLarge,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
}

const QUESTION_WRAPPER: ViewStyle = {
  paddingVertical: spacing.medium,
  borderBottomColor: color.palette.lightGrey,
  borderBottomWidth: 1,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

@inject("questionStore")
@observer
export class QuestionScreen extends React.Component<QuestionScreenProps, {}> {
  componentDidMount() {
    this.fetchQuestions()
  }
  fetchQuestions = () => {
    this.props.questionStore.getQuestions()
  }

  checkAnswer = (question: Question, guess: string) => {
    if (question.isCorrectAnswer(guess)) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Nope! The correct answer is: ${question.correctAnswer}`)
    }
  }

  renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View>
        <View style={QUESTION_WRAPPER}>
          <Text style={QUESTION} text={question.question} />
        </View>
        <RadioForm
          inital={-1}
          radio_props={question.radioProps}
          onPress={guess => this.checkAnswer(question, guess)}
          buttonColor={palette.angry}
          selectedButtonColor={palette.angry}
          labelStyle={{ color: color.text, fontSize: 12 }}
          style={{ paddingVertical: spacing.small }}
          animation={false}
        />
      </View>
    )
  }

  render() {
    const { questionStore } = this.props
    const { questions } = questionStore

    return (
      <Screen style={ROOT} preset="scroll">
        <View style={HEADER_CONTAINER}>
          <Text preset="header" tx="questionScreen.header" />
        </View>
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={this.renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
        />
        <Button onPress={this.fetchQuestions} tx="questionScreen.button" />
      </Screen>
    )
  }
}
