import { filter, map, pipe, sort, take, toArray } from '@fxts/core'
import type { DisplayType, Kanji, Question, QuestionSchema } from '../model/types'
import { randomInteger, shuffle, takeRandom } from './math'

interface CreateQuestionSchema extends QuestionSchema {
  domain: Kanji[]
  batchSize: number
}

export function* createQuestions({ domain, batchSize, ...schema }: CreateQuestionSchema) {
  yield* pipe(
    createAnswerBatch(domain.filter(schema.domainFilter), schema.ordering, batchSize),
    map((batch) => batch.map((trueAnswer) => createQuestion(domain, trueAnswer, schema))),
  )
}

function* createAnswerBatch(
  domain: Kanji[],
  ordering: QuestionSchema['ordering'],
  batchSize: number,
) {
  if (ordering === 'shuffle') {
    domain = shuffle(domain)
  }

  let index = 0

  while (true) {
    if (ordering === 'random') {
      yield Array.from(
        new Array(batchSize),
        () => domain[randomInteger(0, domain.length - 1)],
      )
    } else {
      yield sliceWrapped(domain, index, batchSize)
      index = (index + batchSize) % domain.length
    }
  }
}

function sliceWrapped<T>(list: T[], start: number, size: number) {
  const end = (start + size) % list.length

  if (end <= start) {
    return list.slice(start).concat(list.slice(0, end))
  }
  return list.slice(start, end)
}

function createQuestion(
  domain: Kanji[],
  trueAnswer: Kanji,
  {
    inputType,
    outputTypes,
    choiceCount,
    wrongAnswerRanker,
    isExceptionAllowed = false,
  }: QuestionSchema,
): Question {
  trueAnswer = removeExceptional(isExceptionAllowed, trueAnswer)
  domain = domain.map((kanji) => removeExceptional(isExceptionAllowed, kanji))

  const wrongAnswers = pipe(
    domain,
    removeTrueAnswersFromChoices([trueAnswer], outputTypes),
    map(
      (wrongAnswer) =>
        [wrongAnswer, wrongAnswerRanker(wrongAnswer, trueAnswer, domain)] as const,
    ),
    sort(([_0, a], [_1, b]) => b - a),
    map(([wrongAnswer]) => displayKanjiRandomly(wrongAnswer, outputTypes)),
    removeDuplicatedChoices,
    take(choiceCount - 1),
    toArray,
  )

  return {
    answers: [displayKanjiRandomly(trueAnswer, outputTypes)],
    wrongAnswers,
    directive: getDirective(inputType, outputTypes),
    hint: displayKanji(trueAnswer, inputType),
  }
}

function removeExceptional(isExceptionAllowed: boolean, kanji: Kanji) {
  if (isExceptionAllowed) {
    return kanji
  }

  return {
    ...kanji,
    onyomi: kanji.onyomi.filter((reading) => !reading.includes('[')),
    kunyomi: kanji.kunyomi.filter((reading) => !reading.includes('[')),
  }
}

function removeTrueAnswersFromChoices(trueAnswers: Kanji[], displayTypes: DisplayType[]) {
  return filter<Iterable<Kanji>>((wrongAnswer) =>
    trueAnswers.every((trueAnswer) => !hasAnswer(trueAnswer, wrongAnswer, displayTypes)),
  )
}

function hasAnswer(target: Kanji, choice: Kanji, displayTypes: DisplayType[]) {
  return displayTypes.every((displayType) => {
    if (displayType === 'kanji') {
      return target.kanji === choice.kanji
    }
    return target[displayType].some((reading) => choice[displayType].includes(reading))
  })
}

function removeDuplicatedChoices(list: Iterable<string>) {
  const dup: Record<string, boolean> = { '': true }

  return filter((s) => {
    if (dup[s]) return false
    dup[s] = true
    return true
  }, list)
}

function displayKanjiRandomly(kanji: Kanji, outputTypes: DisplayType[]) {
  const feasibleTypes = shuffle(
    outputTypes.filter((outputType) => displayKanji(kanji, outputType)),
  )
  return displayKanji(kanji, takeRandom(feasibleTypes))
}

function displayKanji(kanji: Kanji, displayType: DisplayType) {
  if (displayType === 'kanji') {
    return kanji.kanji
  }
  const bin = kanji[displayType]
  return bin[randomInteger(0, bin.length - 1)]
}

// TODO: migrate to airport
const DisplayTypeTranslation: Record<DisplayType, string> = {
  kanji: '한자',
  onyomi: '음독',
  kunyomi: '훈독',
}

function getDirective(inputType: DisplayType, outputTypes: DisplayType[]) {
  let outputText = ''

  // 임시. 나중에 기획 고도화 후 결정
  if (outputTypes.length === 2) {
    outputText = '발음'
  } else {
    outputText = DisplayTypeTranslation[outputTypes[0]]
  }

  if (inputType === 'kanji') {
    return `다음 한자의 ${outputText}으로 알맞은 것을 고르시오.`
  }

  const inputText = DisplayTypeTranslation[inputType]

  return `${inputText}이 다음과 같은 ${outputText === '한자' ? '한자' : `한자의 ${outputText}을 고르시오.`}`
}
