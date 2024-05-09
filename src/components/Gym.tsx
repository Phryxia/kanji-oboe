import classnames from 'classnames/bind'
import styles from './Gym.module.css'
import { QuestionViewer } from './QuestionViewer'
import { useQuestionViewer } from './QuestionViewer/useQuestionViewer'

const cx = classnames.bind(styles)

interface Props {}

export function Gym({}: Props) {
  const { isLoading, currentQuestion, goNextQuestion, progress, totalCount } =
    useQuestionViewer()

  return (
    <main className={cx('root')}>
      {isLoading && <div>LOADING...</div>}
      {currentQuestion && (
        <QuestionViewer
          progress={progress}
          totalCount={totalCount}
          onProceed={goNextQuestion}
          question={currentQuestion}
        />
      )}
    </main>
  )
}
