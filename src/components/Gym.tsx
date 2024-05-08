import { QuestionViewer } from './QuestionViewer'
import { useQuestionViewer } from './QuestionViewer/useQuestionViewer'
import { QuestionSchemaViewer } from './QuestionSchemaViewer'

interface Props {}

export function Gym({}: Props) {
  const { isLoading, currentQuestion, goNextQuestion, progress, totalCount } =
    useQuestionViewer()

  return (
    <>
      <QuestionSchemaViewer />
      {isLoading && <div>LOADING...</div>}
      {currentQuestion && (
        <QuestionViewer
          progress={progress}
          totalCount={totalCount}
          onProceed={goNextQuestion}
          question={currentQuestion}
        />
      )}
    </>
  )
}
