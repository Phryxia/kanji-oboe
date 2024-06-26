import { filter, map, pipe, sort, take, toArray } from '@fxts/core'
import type { Choice, DisplayType, Kanji, Question, QuestionSchema } from '../model/types'
import { HIRAGANA_REGEXP, KATAKANA_REGEPX } from '../consts/character'
import { randomInteger, shuffle, takeRandom } from './math'

interface CreateQuestionSchema extends QuestionSchema {
  domain: Kanji[]
  batchSize: number
}

export function* createQuestions({ domain, batchSize, ...schema }: CreateQuestionSchema) {
  const filteredDomain = pipe(
    domain,
    filter(schema.domainFilter),
    removeUnsupportedKanjis(schema.inputType, schema.outputTypes),
    toArray,
  )

  yield* pipe(
    createAnswerBatch(filteredDomain, schema.ordering, batchSize),
    map((batch) =>
      batch.map((trueAnswer) => createQuestion(filteredDomain, trueAnswer, schema)),
    ),
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

function removeUnsupportedKanjis(inputType: DisplayType, outputTypes: DisplayType[]) {
  return filter<Iterable<Kanji>>(
    (kanji) =>
      hasTypeOf(kanji, inputType) &&
      outputTypes.some((outputType) => hasTypeOf(kanji, outputType)),
  )
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
    map(([kanji]) => ({ kanji, ...displayKanjiRandomly(kanji, outputTypes) })),
    removeDuplicatedChoices,
    take(choiceCount - 1),
    toArray,
  )

  const answers = [
    { kanji: trueAnswer, ...displayKanjiRandomly(trueAnswer, outputTypes) },
  ]

  return {
    kanji: trueAnswer.kanji,
    answers,
    wrongAnswers,
    directive: getDirective(inputType, outputTypes),
    hint: displayKanji(trueAnswer, inputType),
    inputType,
    outputTypes,
    trueOutputTypes: answers.map(({ display }) => decideActualType(display)),
  }
}

function removeExceptional(isExceptionAllowed: boolean, kanji: Kanji) {
  if (isExceptionAllowed) {
    return kanji
  }

  return {
    ...kanji,
    onyomi: kanji.onyomi?.filter((reading) => !reading.includes('[')),
    kunyomi: kanji.kunyomi?.filter((reading) => !reading.includes('[')),
  }
}

function removeTrueAnswersFromChoices(trueAnswers: Kanji[], displayTypes: DisplayType[]) {
  return filter<Iterable<Kanji>>((wrongAnswer) =>
    displayTypes.every((displayType) =>
      trueAnswers.every(
        (trueAnswer) => !hasIntersection(trueAnswer, wrongAnswer, displayType),
      ),
    ),
  )
}

function hasTypeOf(k: Kanji, displayType: DisplayType) {
  return displayType === 'kanji' || !!k[displayType]?.length
}

function hasIntersection(a: Kanji, b: Kanji, displayType: DisplayType) {
  if (displayType === 'kanji') {
    return a.kanji === b.kanji
  }
  return a[displayType]?.some((element) => b[displayType]?.includes(element))
}

function removeDuplicatedChoices(list: Iterable<Choice>) {
  const dup: Record<string, boolean> = { '': true }

  return filter(({ display }) => {
    if (dup[display]) return false
    dup[display] = true
    return true
  }, list)
}

function displayKanjiRandomly(kanji: Kanji, outputTypes: DisplayType[]) {
  const feasibleTypes = shuffle(
    outputTypes.filter(
      (outputType) => outputType === 'kanji' || !!kanji[outputType]?.length,
    ),
  )
  const displayType = takeRandom(feasibleTypes)
  return {
    type: displayType,
    display: displayKanji(kanji, displayType),
  }
}

function displayKanji(kanji: Kanji, displayType: DisplayType) {
  if (displayType === 'kanji') {
    return kanji.kanji
  }
  const bin = kanji[displayType]

  return bin?.[randomInteger(0, bin.length - 1)] ?? ''
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

  return `${inputText}이 다음과 같은 ${outputText === '한자' ? '한자를' : `한자의 ${outputText}을`} 고르시오`
}

export function decideActualType(choice: string): DisplayType {
  if (HIRAGANA_REGEXP.test(choice)) {
    return 'kunyomi'
  }
  if (KATAKANA_REGEPX.test(choice)) {
    return 'onyomi'
  }
  return 'kanji'
}
