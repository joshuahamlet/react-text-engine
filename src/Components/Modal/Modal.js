import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import {
  characterAtom,
  currentRoomAtom,
  itemAtom,
  modalAtom,
  callActionAtom,
  activationAtom,
  gameInstanceAtom,
  roomAtom,
} from '../../Atoms';
import { AnimatePresence, motion } from 'framer-motion';
import { buildCharacters, buildItems } from '../../GameData/Actions';

import '../components.css';
import Layout_Gameboy from './Layout_Gameboy';
import Layout_Look from './Layout_Look';
import Layout_Take from './Layout_Take';
import Layout_Talk from './Layout_Talk';
import Layout_Navigate from './Layout_Navigate';

const Modal = () => {
  const [modal, setModal] = useAtom(modalAtom);
  const [globalCharacters, setGlobalCharacters] = useAtom(characterAtom);
  const [globalItems, setGlobalItems] = useAtom(itemAtom);
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const [callAction, setCallAction] = useAtom(callActionAtom);
  const [activated, setActivated] = useAtom(activationAtom);
  const [gameInstance, setGameInstance] = useAtom(gameInstanceAtom);
  const [rooms, setRooms] = useAtom(roomAtom)

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const timer = setTimeout(() => {
      backdropClick();
      gameInstance && gameInstance.destroy(true, false);
        setCallAction({
          action: 'NOTIFY',
          payload: [],
        });
        console.log('ROOOOOOOOOOOOOMY', rooms)
        //console.log('ROOOOOOOOOOOOOMz', rooms.find(x => x.id === 'home').exits.find(x => x.id === 'bridge') = false)
        setRooms(p => [...p, rooms.find(x => x.id === 'home').exits.find(x => x.id === 'bridge').blocked = false])
    }, 3000);
    return () => clearTimeout(timer);
  }, [activated]);

  const showModalBG = {
    zIndex: '9',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    opacity: '1',
  };

  let game;
  let testButton;
  let upButton;
  let downButton;
  let leftButton;
  let rightButton;
  let glitchTrigger;

  let observable = [];
  let talkable = [];

  const buildTalkable = () => {
    talkable = globalCharacters.filter(
      (x) => x.room.toUpperCase() === currentRoom.name.toUpperCase()
    );
    console.log('TALKABLE', talkable);
    return talkable;
  };

  buildTalkable();

  const buildObservable = () => {
    let items = buildItems(globalItems, currentRoom);
    let characters = buildCharacters(globalCharacters, currentRoom);
    observable = [...items, ...characters];

    console.log(observable);
    return observable;
  };

  buildObservable();

  const backdropClick = () => {
    setModal((p) => ({ ...p, visible: !p.visible }));
    gameInstance && gameInstance.destroy(true, false);
  };

  return (
    <AnimatePresence>
      {modal.visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={showModalBG}
            onClick={backdropClick}
          ></motion.div>
          <motion.div
            className='componentSizingModal'
            initial={{ x: '100%', y: '-50%' }}
            animate={{ x: '-50%', y: '-50%' }}
            exit={{ x: '100vw', y: '-50%' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              textAlign: 'start',
            }}
          >
            {modal.type === 'LOOK' && <Layout_Look />}
            {modal.type === 'NAVIGATE' && <Layout_Navigate />}
            {modal.type === 'GAMEBOY1' && <Layout_Gameboy />}
            {modal.type === 'TAKE' && <Layout_Take />}
            {modal.type === 'TALK' && <Layout_Talk />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
