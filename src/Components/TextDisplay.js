import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import * as Dictionary from '../GameData/Dictionaries';
import {
  textHistoryAtom,
  mainStackAtom,
  currentInventoryAtom,
  userTextAtom,
  callActionAtom,
  currentRoomAtom,
  itemAtom,
  roomAtom,
  helpCountdownAtom,
  characterAtom,
} from '../Atoms';
import { useHistory } from 'react-router-dom';
import { Rooms } from '../GameData/Rooms';
import './components.css';

const TextDisplay = () => {
  const [textHistory, setTextHistory] = useAtom(textHistoryAtom);
  const [mainStack, setMainStack] = useAtom(mainStackAtom);
  const [userText, setUserText] = useAtom(userTextAtom);
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const [globalItems, setGlobalItems] = useAtom(itemAtom);
  const [rooms, setRooms] = useAtom(roomAtom);
  const [globalCharacters, setGlobalCharacters] = useAtom(characterAtom);
  const [currentInventory, setCurrentInventory] = useAtom(currentInventoryAtom);
  const [callAction, setCallAction] = useAtom(callActionAtom);
  const [helpCountdown, setHelpCountdown] = useAtom(helpCountdownAtom);

  const history = useHistory();

  const actionDispatcher = ({ action, payload } = callAction) => {
    console.log(action, payload);
    switch (action) {
      case 'CHECK_INVENTORY':
        checkInventory(payload);
        break;
      case 'CHECK_ROOM':
        checkRoom();
        break;
      case 'CHECK_ITEM':
        checkItem(payload);
        break;
      case 'HANDLE_DIRECTION':
        handleDirection(payload);
        console.log(payload);
        break;
      case 'TAKE_ITEM':
        takeItem(payload);
        break;
      case 'TALK':
        talk(payload);
        break;
      case 'HELP':
        help(payload);
        break;
      case 'NOTIFY':
        notify();
        break;
      case 'UNKNOWN':
        handleUnknown(payload);
        break;
      default:
        return;
    }
  };

  const buildCharacters = () => {
    let availableCharacters = [];
    globalCharacters.map((c) => {
      if (c.room === currentRoom.id) availableCharacters.push(c);
    });
    return availableCharacters;
  };

  const buildItems = () => {
    let availableItems = [];
    globalItems.map((i) => {
      if (i.room === currentRoom.id && i.found && !i.taken)
        availableItems.push(i);
    });
    return availableItems;
  };

  //////////
  const checkItem = (userTextArray) => {
    console.log('USERTEXTARRAY', userTextArray);
    console.log('GLOBALITEMS', globalItems);
    const entities = [...globalItems, ...globalCharacters];
    const item = entities.find(
      (x) => x.name.toUpperCase() === userTextArray[1]
    );

    if (!item) {
      console.log('ABORT!!!');
      setMainStack((prev) => [
        ...prev,
        { text: userTextArray.join(' '), textOrigin: 'user' },
      ]);
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
    setMainStack((prev) => [
      ...prev,
      { text: userTextArray.join(' '), textOrigin: 'user' },
    ]);
    setMainStack((prev) => [
      ...prev,
      { text: itemDescription, textOrigin: 'system' },
    ]);
    setUserText('');
  };
  //////////
  const handleDirection = (chosenDirection) => {
    const choiceIndex = currentRoom.exits.findIndex(
      (r) => r.dir === chosenDirection[0]
    );
    const exitChoice = currentRoom.exits[choiceIndex];
    console.log(exitChoice);
    const roomUpdate = exitChoice.blocked
      ? currentRoom
      : Rooms[Rooms.findIndex((r) => r.id === exitChoice.id)];
    const exitText = exitChoice.blocked
      ? exitChoice.blockedText
      : exitChoice.desc;
    setCurrentRoom(roomUpdate);
    setMainStack((prev) => [
      ...prev,
      { text: chosenDirection, textOrigin: 'user' },
    ]);
    setMainStack((prev) => [...prev, { text: exitText, textOrigin: 'system' }]);
    setUserText('');
  };
  //////////
  const talk = (userTextArray) => {
    console.log(currentInventory);
    let talkText = '';
    let additionalText = '';
    if (userTextArray.length === 1 || userTextArray[1] === 'SELF') {
      additionalText =
        'You mumble something quietly to yourself. Rememer to practice compassionate self-talk!';
    } else if (userTextArray.length === 2) {
      const characters = buildCharacters(currentRoom.id, globalCharacters);
      const items = buildItems(currentRoom.id, globalItems);
      const availableCharacters = [...characters];
      const availableItems = [...items, ...currentInventory];
      if (
        availableCharacters.find(
          (x) => x.name.toUpperCase() === userTextArray[1]
        )
      ) {
        const foundCharacter = globalCharacters.find(
          (x) => x.name.toUpperCase() === userTextArray[1]
        );
        talkText =
          foundCharacter.name + ': \n' + `    ${foundCharacter.response()}`;
        additionalText = foundCharacter.commentary;
      } else if (
        availableItems.find((x) => x.name.toUpperCase() === userTextArray[1])
      ) {
        additionalText = 'Talking to inanimate objects? Are you alright?';
      } else {
        additionalText = 'Hmm? Who exactly are you trying to talk to?';
      }
    }

    setMainStack((prev) => [
      ...prev,
      { text: userTextArray.join(' '), textOrigin: 'user' },
    ]);
    setMainStack((prev) =>
      talkText
        ? [...prev, { text: talkText, textOrigin: 'character' }]
        : [...prev]
    );
    setMainStack((prev) =>
      additionalText
        ? [...prev, { text: additionalText, textOrigin: 'system' }]
        : [...prev]
    );
    setUserText('');
  };
  //////////
  const help = () => {
    history.push('/help');
    setCallAction({ action: '', payload: [] });
    setUserText('');
  };
  //////////
  const takeItem = (userTextArray) => {
    console.log('TAKEITEM', userTextArray);
    const availableItems = buildItems();
    const item = availableItems.find(
      (x) => x.name.toUpperCase() === userTextArray[1]
    );

    let updatedInventory = [];
    let updatedGlobalItems = [];
    let itemText = '';

    if (!item) {
      updatedInventory = [...currentInventory];
      updatedGlobalItems = [...globalItems];
      itemText = `Hmm, can't seem to find that...`;
    }

    if (item && !item.taken && item.getAble) {
      if (item.taken) {
        itemText = `It's already in your inventory.`;
        updatedGlobalItems = [...globalItems];
        updatedInventory = [...currentInventory];
      } else if (!item.taken) {
        updatedGlobalItems = globalItems.map((i) => {
          if (i.name === item.hiddenBy) {
            const hidingIndex = i.hiding.findIndex((x) => x.name === item.name);
            console.log(hidingIndex);
            console.log(i.hiding[hidingIndex]);
            i.hiding[hidingIndex].taken = true;
            console.log(i);
          } else if (i.name === item.name) {
            i.taken = true;
            updatedInventory = [...currentInventory, i];
          }
        });
        itemText = item.getText;
      }
    }

    if (item && !item.getAble) {
      itemText = item.getText;
      updatedGlobalItems = [...globalItems];
      updatedInventory = [...currentInventory];
    }

    setCurrentInventory(updatedInventory);
    setMainStack((prev) => [
      ...prev,
      { text: userTextArray.join(' '), textOrigin: 'user' },
    ]);
    setMainStack((prev) => [...prev, { text: itemText, textOrigin: 'system' }]);
    setUserText('');
  };
  //////////
  const checkInventory = (userTextArray) => {
    const inv = currentInventory.map((item) => `• ${item.name}`);
    const invMessage = 'Your current inventory: \n' + inv.join('\n');
    console.log(invMessage);
    setMainStack((prev) => [
      ...prev,
      { text: userTextArray[0], textOrigin: 'user' },
    ]);
    setMainStack((prev) => [
      ...prev,
      { text: invMessage, textOrigin: 'system' },
    ]);
    setUserText('');
  };
  //////////
  const checkRoom = () => {
    const items = buildItems(currentRoom.id, globalItems);
    const characters = buildCharacters(currentRoom.id, globalCharacters);
    const availableArray = [...items, ...characters];
    const availableEntities = availableArray.map(
      (entity) => `• ${entity.name}`
    );
    const entityMessage =
      'In this place you notice: \n' + availableEntities.join('\n');
    console.log(entityMessage);
    setMainStack((prev) => [...prev, { text: userText, textOrigin: 'user' }]);
    setMainStack((prev) => [
      ...prev,
      { text: entityMessage, textOrigin: 'system' },
    ]);
    setUserText('');
  };
  //////////
  const handleUnknown = () => {
    let resetCountdown = false;

    if (helpCountdown >= 2) {
      resetCountdown = true;
    }

    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    };

    const help =
      'If you would like to see some notes on available commands, you can enter HELP.';

    const responses = [
      'Pardon? Could you try that again?',
      `Didn't quite catch that. Try again, please.`,
      'Eh? Sorry, could you try that one more time?',
    ];

    setMainStack((prev) => [...prev, { text: userText, textOrigin: 'user' }]);
    setMainStack((prev) => [
      ...prev,
      {
        text: resetCountdown ? help : responses[getRandomInt(3)],
        textOrigin: 'system',
      },
    ]);
    setUserText('');
    setHelpCountdown((prev) => (resetCountdown ? 0 : prev + 1));
  };
  //////////
  const notify = () => {
    const response = `Hmm, uh oh. Seems to be old and glitchy. Even blowing into the cartridge doesn't seem to help`;

    setMainStack((prev) => [
      ...prev,
      {
        text: response,
        textOrigin: 'system',
      },
    ]);
    setUserText('');
  };
  //###########################################################

  const scrollHere = useRef(null);
  const scrollToBottom = () => {
    scrollHere.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    actionDispatcher();
  }, [callAction]);

  useEffect(() => {
    scrollToBottom();
  });

  const userTextStyle = {
    width: '90%',
    color: 'var(--green)',
    backgroundColor: 'var(--darkGrey)',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    alignSelf: 'flex-start',
    margin: '4px',
    borderRadius: '5px',
    whiteSpace: 'pre-line',
  };

  const systemTextStyle = {
    width: '90%',
    color: 'var(--white )',
    backgroundColor: 'var(--red)',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    alignSelf: 'flex-end',
    margin: '4px',
    borderRadius: '5px',
    whiteSpace: 'pre-line',
  };

  const characterTextStyle = {
    width: '90%',
    color: 'var(--cyan)',
    backgroundColor: 'var(--blue)',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'left',
    alignSelf: 'flex-end',
    margin: '4px',
    borderRadius: '5px',
    whiteSpace: 'pre',
  };

  return (
    <div
      className='componentSizingText'
      style={{
        backgroundColor: 'var(--black)',
        margin: '5px',
        padding: '15px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        overflowX: 'hidden',
        border: '5px solid black',
      }}
    >
      {mainStack.map((text) => {
        return (
          <div
            className='textStyle'
            style={
              text.textOrigin === 'user'
                ? userTextStyle
                : text.textOrigin === 'system'
                ? systemTextStyle
                : characterTextStyle
            }
          >
            {(text.textOrigin === 'user' ? '> ' : '') + text.text}
          </div>
        );
      })}
      <div ref={scrollHere} />
    </div>
  );
};

export default TextDisplay;
