import { Heading } from '@digdir/designsystemet-react';
import PlaygroundGUI from '../components/PlaygroundGUI/PlaygroundGUI.client';

export default function Playground() {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Heading
        level={2}
        size='large'
        spacing
      >
        Lekeplass
      </Heading>
      <PlaygroundGUI />
    </div>
  );
}
