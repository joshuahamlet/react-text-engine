import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

function Help() {
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
      HELP
    </motion.div>
  );
}

export default Help;
