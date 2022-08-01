import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { FaBullseye } from 'react-icons/fa';
import { MdOutlinePowerSettingsNew } from 'react-icons/md';
import { activationAtom, gameInstanceAtom } from '../../Atoms';
import Game1 from '../../GameData/Gameboy/phaserGame';
import { TouchController } from '../../GameData/Gameboy/phaserGame';

const Layout_Gameboy = () => {
  const [gameInstance, setGameInstance] = useAtom(gameInstanceAtom);
  const [activated, setActivated] = useAtom(activationAtom);

  const motherFucker = () => {
    console.log('motherFUCKER!!!!!!!');
  };

  useEffect(() => {
    console.log('FUUUCK', setActivated);
  }, []);

  let game1;

  const generateCanvas1 = () => {
    if (gameInstance && !gameInstance.removeCanvas) {
      console.log('pre-DESTROY', gameInstance);
      gameInstance.destroy(true, false);
      console.log('DESTROYGAME', gameInstance);
    } else {
      console.log('pre-REBOOTGAME', gameInstance);
      game1 = new Game1(setActivated, touchControl);
      setGameInstance(game1);
      console.log('REBOOTGAME', gameInstance);
      return game1;
    }
  };

  let touchControl = false;

  return (
    <>
      <div style={{ width: '240px', alignSelf: 'center', margin: '15px' }}>
        <div
          style={{
            display: 'flex',
            width: '40px',
            height: '40px',
            textAlign: 'center',
            fontSize: '33px',
            fontFamily: 'commodore',
            borderRadius: '5px',
            color: 'var(--red)',
            backgroundColor: 'var(--grey)',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '3px 3px 1px black',
            outline: 'none',
          }}
          onClick={generateCanvas1}
        >
          <MdOutlinePowerSettingsNew />
        </div>
      </div>
      <div
        style={{
          alignSelf: 'center',
          justifySelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '280px',
          height: '200px',
          backgroundColor: 'black',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            alignSelf: 'center',
            justifySelf: 'center',
            width: '280px',
            height: '200px',
            backgroundColor: 'black',
            padding: '20px',
            borderRadius: '10px',
          }}
          id='gameboy1'
        />
      </div>
      <TouchController />
    </>
  );
};

export default Layout_Gameboy;
