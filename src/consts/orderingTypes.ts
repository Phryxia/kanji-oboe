import type { LabelPair, OrderingType } from '../model/types'

export const OrderingTypes: OrderingType[] = ['random', 'shuffle', 'round-robin']

export const LabeledOrderingTypes: LabelPair<OrderingType>[] = [
  {
    value: 'random',
    label: '무작위',
  },
  {
    value: 'shuffle',
    label: '섞어서',
  },
  {
    value: 'round-robin',
    label: '순서대로',
  },
]
