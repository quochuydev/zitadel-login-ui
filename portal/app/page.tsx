import Home from '@/components/Home';
import { getAllSessions } from '@/lib/cookies';
import { createSessionClient, serviceAccount } from '@/instrumentation-node';

export default async function Page() {
  const sessionIds = getAllSessions().map((e) => e.sessionId);
  const sessionService = createSessionClient(serviceAccount);

  const sessionResult = sessionIds.length
    ? await sessionService.listSessions({
        queries: [{ idsQuery: { ids: sessionIds } }],
      })
    : { sessions: [] };

  return <Home sessions={sessionResult.sessions} />;
}
