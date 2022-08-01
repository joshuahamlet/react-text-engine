import { currentInventoryAtom, mainStackAtom } from "../Atoms"
import { useAtom } from "jotai"

export const buildInventory = items => {
  let inventoryItems = []

  if (items) {
    items.map(item => {
      if (item.inInv) inventoryItems.push(item)
    })
  }

  return inventoryItems
}

export const buildItems = (currentRoom, items) => {
  let availableItems = []

  if (items) {
    items.map(item => {
      if (item.room === currentRoom && item.found && !item.taken) availableItems.push(item)
    })
  }

  return availableItems
}

export const useCheckInventory = () => {
  const [mainStack, setMainStack] = useAtom(mainStackAtom);
  const [currentInventory, setCurrentInventory] = useAtom(currentInventoryAtom)

  setMainStack(prev => [...prev, currentInventory !== undefined ? currentInventory.map(item => item.name + ',') : ''])
}

export const userActions = [
  'LOOK',
  'USE',
  'TAKE',
  'INV',
]