import { atom } from 'jotai';
import { Rooms } from './GameData/Rooms';
import { Items } from './GameData/Items';
import { Characters } from './GameData/Characters';

export const textHistoryAtom = atom([]);

export const mainStackAtom = atom([]);

export const userStackAtom = atom((get) => get(mainStackAtom).filter(x => x.textOrigin === 'user').map(i => i.text))

export const currentRoomAtom = atom(Rooms[0]);

export const currentInventoryAtom = atom([]);

export const gameInInventoryAtom = atom ((get) => {
  let currentInv = get(currentInventoryAtom)
  let gameboyInv = currentInv.filter(x => x.name === 'Gameboy')
  console.log('GAMEBOYINV', gameboyInv)
  let cartridgeInv = currentInv.filter(x => x.name === 'Cartridge')
  console.log('CartrigeINV', cartridgeInv)
  console.log('ISITTRUE?????GB', gameboyInv)
  console.log('ISITTRUE?????CT', cartridgeInv)
  let fullGameboy = [...gameboyInv, ...cartridgeInv]

  if (fullGameboy.length === 2) {
    return true
  } else {
    return false
  }
})

export const roomAtom = atom(Rooms || []);

export const itemAtom = atom(Items || []);

export const characterAtom = atom(Characters || []);

export const userTextAtom = atom('')

export const callActionAtom = atom({action: '', payload: []})

export const helpCountdownAtom = atom(0)

export const modalAtom = atom({visible: false, type: ''})

export const keyboardAtom = atom(false)

export const activationAtom = atom(false)

export const gameInstanceAtom = atom()

export const touchControlAtom = atom({upButton: false, downButton: false, leftButton: false, rightButton: false})