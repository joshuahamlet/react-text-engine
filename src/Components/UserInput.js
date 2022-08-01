import { useAtom } from 'jotai';
import { useRef, useEffect } from 'react';
import {
  textHistoryAtom,
  currentInventoryAtom,
  currentRoomAtom,
  itemAtom,
  userTextAtom,
  callActionAtom,
  modalAtom,
  keyboardAtom,
  userStackAtom,
  gameInInventoryAtom,
} from '../Atoms';
import { buildInventory, userActions } from '../GameData/UserController';
import * as Dictionary from '../GameData/Dictionaries';
import { useState } from 'react';
import { BiHelpCircle } from 'react-icons/bi';
import { ImCompass2, ImBubbles, ImEye } from 'react-icons/im';
import { MdVideogameAsset, MdBackpack } from 'react-icons/md';
import { GiHand } from 'react-icons/gi';
import { FaKeyboard } from 'react-icons/fa';
import './components.css';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';

const UserInput = () => {
  const [userText, setUserText] = useAtom(userTextAtom);
  const [currentInventory, setCurrentInventory] = useAtom(currentInventoryAtom);
  const [globalItems, setGlobalItems] = useAtom(itemAtom);
  const [callAction, setCallAction] = useAtom(callActionAtom);
  const [modal, setModal] = useAtom(modalAtom);
  const [commandCount, setCommandCount] = useState(0);
  const [keyboardToggle, setKeyboardToggle] = useAtom(keyboardAtom);
  const [userStack] = useAtom(userStackAtom);
  const [gameInInventory] = useAtom(gameInInventoryAtom);

  const history = useHistory();

  useEffect(() => {
    console.log('IS IT IN', gameInInventory);
    console.log('USER-INPUT-RENDER');
    console.log('DERIVED', userStack);
    const inv = buildInventory(globalItems);
    setCurrentInventory([...inv]);
  }, []);

  const textInput = useRef(null);
  const formInput = useRef(null);

  const inputContainer = {
    backgroundColor: 'var(--grey)',
    textAlign: 'center',
    margin: '5px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const inputField = {
    width: '100%',
    borderRadius: '5px',
    display: 'flex',
    padding: '10px',
    color: 'var(--green)',
    marginTop: '10px',
  };

  const autoTextContainer = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const autoTextBtn = {
    fontFamily: 'commodore',
    borderRadius: '5px',
    color: 'var(--darkGrey)',
    padding: '7px',
    boxShadow: '3px 3px 1px black',
    outline: 'none',
    // marginLeft: '5px',
    // marginRight: '3px',
    // marginBottom: '10px',
  };

  const handleChange = (e) => {
    setUserText(e.target.value.toUpperCase());
  };

  const handlePrevCmdSelect = (e) => {
    let keyIsArrow = false;
    let commandText = '';
    console.log('key is', e.key);
    if (e.key === 'ArrowUp') {
      keyIsArrow = true;
      commandText = userStack[userStack.length - 1 - commandCount];
    } else if (e.key === 'ArrowDown') {
      keyIsArrow = true;
      commandText = userStack[userStack.length - 1 - (commandCount - 2)];
    } else if (!keyIsArrow) {
      console.log('CMDCOUNT', commandCount);
    }

    setCommandCount((p) =>
      e.key === 'ArrowUp' && commandCount < userStack.length - 1
        ? p + 1
        : e.key === 'ArrowDown' && commandCount > 0
        ? p - 1
        : 0
    );
    setUserText((p) => (keyIsArrow && commandText ? commandText : p));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userTextArray = userText.split(' ');
    let checklist = [...Dictionary.articles, ...Dictionary.prepositions];
    let scrubbedArray = userTextArray.filter(
      (t) => checklist.includes(t) === false
    );

    let action = Dictionary.MainDictionary[scrubbedArray[0]]
      ? Dictionary.MainDictionary[scrubbedArray[0]][scrubbedArray.length - 1]
      : 'UNKNOWN';

    setCallAction({ action, payload: scrubbedArray });
  };

  const handleDelete = (e) => {
    setUserText('');
    textInput.current.focus();
  };

  const modalHandler = (type) => {
    setModal((p) => ({ visible: !p.visible, type }));
  };

  const helpHandler = () => {
    history.push('/help');
    setCallAction({ action: '', payload: [] });
    setUserText('');
  };

  return (
    <AnimateSharedLayout>
      <motion.div
        transition={{ duration: '.25' }}
        layout='crossfade'
        className='componentSizingInput'
        style={inputContainer}
      >
        <div style={autoTextContainer}>
          <div
            onClick={() => modalHandler('LOOK')}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <ImEye />
          </div>
          <div
            onClick={() => modalHandler('NAVIGATE')}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <ImCompass2 />
          </div>

          <div
            onClick={() => modalHandler('TAKE')}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <GiHand />
          </div>
          <div
            onClick={() =>
              setCallAction({ action: 'CHECK_INVENTORY', payload: ['INV'] })
            }
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <MdBackpack />
          </div>
          <div
            onClick={() => modalHandler('TALK')}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <ImBubbles />
          </div>
          <div
            onClick={() => setKeyboardToggle((p) => !p)}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <FaKeyboard />
          </div>
          <AnimatePresence>
          {gameInInventory && (
            <motion.div
              initial={{ scale: 0, x: '-50%' , backgroundColor:'var(--lightGreen)'}}
              animate={{ scale: 1, x: '0%', backgroundColor:'var(--green)' }}
              exit={{ scale: 0, x: '-50%' }}
              transition={{scale: { duration: 0.5 }, backgroundColor: {duration: .5, repeat: 6}}}
              onClick={() => modalHandler('GAMEBOY1')}
              className='autoTextBtn'
              style={{ ...autoTextBtn }}
            >
              <MdVideogameAsset />
            </motion.div>
          )}
          </AnimatePresence>
          <div
            onClick={helpHandler}
            className='autoTextBtn'
            style={{ ...autoTextBtn }}
          >
            <BiHelpCircle />
          </div>
        </div>
        <AnimatePresence>
          {keyboardToggle && (
            <motion.div
              initial={{ scale: 0, x: '-50%' }}
              animate={{ scale: 1, x: '0%' }}
              exit={{ scale: 0, x: '-50%' }}
              transition={{ duration: 0.5 }}
            >
              <form
                ref={formInput}
                style={{ width: '100%', display: 'flex' }}
                onSubmit={handleSubmit}
              >
                <input
                  ref={textInput}
                  className='inputField'
                  style={inputField}
                  placeholder='Enter Command...'
                  type='text'
                  value={userText}
                  onChange={handleChange}
                  onKeyDown={handlePrevCmdSelect}
                />
                <button
                  className='autoTextBtnMod'
                  type='reset'
                  onClick={handleDelete}
                  onTouchEnd={handleDelete}
                >
                  x
                </button>
                <button className='autoTextBtnMod' type='submit'>
                  &raquo;
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default UserInput;
