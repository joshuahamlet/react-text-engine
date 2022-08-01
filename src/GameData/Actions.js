import * as Dictionary from './Dictionaries';

export const buildCharacters = (globalCharacters, currentRoom) => {
  let availableCharacters = [];
  globalCharacters.map((c) => {
    if (c.room === currentRoom.id) availableCharacters.push(c);
  });
  return availableCharacters;
};

export const buildItems = (globalItems, currentRoom) => {
  let availableItems = [];
  globalItems.map((i) => {
    if (i.room === currentRoom.id && i.found && !i.taken)
      availableItems.push(i);
  });
  return availableItems;
};

export const CheckInventory = (
  userText,
  setUserText,
  userTextArray,
  currentInventory,
  setMainStack
) => {
  if (Dictionary.invSynonyms.includes(userTextArray[0])) {
    const inv = currentInventory.map((item) => `• ${item.name}`);
    const invMessage = 'Your current inventory: \n' + inv.join('\n');
    console.log(invMessage);
    setMainStack((prev) => [...prev, { text: userText, textOrigin: 'user' }]);
    setMainStack((prev) => [
      ...prev,
      { text: invMessage, textOrigin: 'system' },
    ]);
    setUserText('');
  }
};

export const CheckRoom = (
  userText,
  setUserText,
  userTextArray,
  currentRoom,
  globalItems,
  setMainStack,
) => {
  if (
    Dictionary.lookSynonyms.includes(userTextArray[0]) &&
    userTextArray.length <= 1
  ) {
    const items = buildItems(currentRoom.id, globalItems);
    const availableItems = items.map((item) => `• ${item.name}`);
    const itemMessage =
      'In this place you notice: \n' + availableItems.join('\n');
    console.log(itemMessage);
    setMainStack((prev) => [...prev, { text: userText, textOrigin: 'user' }]);
    setMainStack((prev) => [
      ...prev,
      { text: itemMessage, textOrigin: 'system' },
    ]);
    setUserText('');
  }
};

  //////////
  export const checkItem = (payload, globalItems, setGlobalItems, globalCharacters, setGlobalCharacters, setMainStack, userText, setUserText) => {
    console.log('USERTEXTARRAY', payload);
    console.log('GLOBALITEMS', globalItems);
    const entities = [...globalItems, ...globalCharacters]
    const item = entities.find(
      (x) => x.name.toUpperCase() === payload[1]
    );

    if (!item) {
      console.log('ABORT!!!');
      setMainStack((prev) => [...prev, { text: payload.join(' '), textOrigin: 'user' }]);
      setMainStack((prev) => [
        ...prev,
        { text: `Can't seem to find that...`, textOrigin: 'system' },
      ]);
      setUserText('');
      return;
    }

    let hiddenItemText = '';
    if (item && item.hiding) {
      item &&
        item.hiding.map((i) =>
          !i.taken ? (hiddenItemText += ` ${i.availableText}`) : ''
        );
    }

    const itemDescription = item
      ? item.desc + hiddenItemText
      : `Can't seem to find that...`;

    let itemsUpdated = [];

    if (item && item.hiding) {
      const hiddenList = item.hiding.map((i) => i.name);
      itemsUpdated = globalItems.map((i) => {
        if (hiddenList.includes(i.name)) {
          return { ...i, found: true };
        } else {
          return { ...i };
        }
      });
    }
    setGlobalItems([...itemsUpdated]);
    setMainStack((prev) => [...prev, { text: payload.join(' '), textOrigin: 'user' }]);
    setMainStack((prev) => [
      ...prev,
      { text: itemDescription, textOrigin: 'system' },
    ]);
    setUserText('');
  };
  //////////
