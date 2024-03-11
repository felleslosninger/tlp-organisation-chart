import { Container } from '../Container/Container';

import classes from './Header.module.css';
import { Heading } from '@digdir/designsystemet-react';

export const Header = () => {
  return (
    <header className={classes.header}>
      <Container>
        <div className={classes.left}>
          <Heading size='small'>Organisation Chart</Heading>
        </div>

        <div className={classes.right}></div>
      </Container>
    </header>
  );
};
