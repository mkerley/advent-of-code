import { Opponent, Player, Points } from './enums'

export const outcomes = {
  [Opponent.rock]: {
    [Player.rock]: Points.rock + Points.draw,
    [Player.paper]: Points.paper + Points.win,
    [Player.scissors]: Points.scissors + Points.lose,
  },

  [Opponent.paper]: {
    [Player.rock]: Points.rock + Points.lose,
    [Player.paper]: Points.paper + Points.draw,
    [Player.scissors]: Points.scissors + Points.win,
  },

  [Opponent.scissors]: {
    [Player.rock]: Points.rock + Points.win,
    [Player.paper]: Points.paper + Points.lose,
    [Player.scissors]: Points.scissors + Points.draw,
  },
}
