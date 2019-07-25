import * as React from "react"
import { observer, inject } from "mobx-react"
import { ViewStyle, View, FlatList, TextStyle, TouchableOpacity } from "react-native"
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

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
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

  renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View>
        <View style={QUESTION_WRAPPER}>
          <Text style={QUESTION} text={question.question} />
        </View>
        <View>
          {question.allAnswers.map((a, index) => {
            return (
              <TouchableOpacity key={index} style={ANSWER_WRAPPER}>
                <Text style={ANSWER} text={a} />
              </TouchableOpacity>
            )
          })}
        </View>
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
