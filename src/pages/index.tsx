import { trpc } from '../utils/trpc';
import { Chat } from '~/components/chat';

export default function IndexPage() {
  return (
    <div className='h-screen'>
      <Chat></Chat>
    </div>
  );
}
