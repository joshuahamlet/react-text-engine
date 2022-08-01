import './Game.css';
import './Components/components.css';
import MainDisplay from './Components/MainDisplay';
import TextDisplay from './Components/TextDisplay';
import UserInput from './Components/UserInput';
import { motion } from 'framer-motion';

function Game() {
  return (
    <motion.div
      initial={{ y: '-100vh' }}
      animate={{ y: '0vh' }}
      exit={{ y: '-100vh' }}
      transition={{ duration: 0.5 }}
      className='App'
    >
      <MainDisplay />
      <TextDisplay />
      <UserInput />
    </motion.div>
  );
}

export default Game;
 