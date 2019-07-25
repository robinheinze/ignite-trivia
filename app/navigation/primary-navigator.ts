import { createStackNavigator } from "react-navigation"
import { QuestionScreen } from "../screens/question-screen"

export const PrimaryNavigator = createStackNavigator(
  {
    question: { screen: QuestionScreen },
  },
  {
    headerMode: "none",
  },
)
