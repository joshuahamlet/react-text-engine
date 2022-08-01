import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

function Intro() {
  useEffect(() => {
    window.addEventListener('keydown', handleRedirect);

    return () => {
      window.removeEventListener('keydown', handleRedirect);
    };
  });

  let history = useHistory();

  const handleRedirect = () => {
    history.push('/game');
  };

  return (
    <motion.div
      initial={{ y: '100vh' }}
      animate={{ y: '0vh' }}
      exit={{ y: '100vh' }}
      transition={{ duration: 0.5 }}
      onClick={handleRedirect}
      style={{
        height: '100vh',
        width: '100vw',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '30px',
          marginBottom: '20px',
          animation: 'markerBlink 2s infinite',
        }}
      >
        Hey a Title
      </div>
      <div style={{width: '95vw'}}>
        HOWDY. This is the intro for the game it will have some background
        info/context and maybe a reminder of how to get to the help menu if you
        are new to text adventures.
      </div>
    </motion.div>
  );
}

export default Intro;
