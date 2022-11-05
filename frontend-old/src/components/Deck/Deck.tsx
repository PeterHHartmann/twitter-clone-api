import DeckHeader from './DeckHeader/DeckHeader';
import Route from '../Route';
import style from './Deck.module.scss';
import stars from '../../assets/stars.svg';

function Deck() {

  return (
    <main className={style.deck}>
      <Route path='/'>
        <DeckHeader name='Home' href="/" icon={stars} />
      </Route>
      <Route path='/notifications'>
        <DeckHeader name='Notifications' href='/notifications' />
      </Route>
    </main>
  );
}

export default Deck;
