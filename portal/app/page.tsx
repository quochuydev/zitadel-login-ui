import Home from '@/components/Home';
import { getAllSessions } from '@/lib/cookies';
import { createSessionClient, serviceAccount } from '@/instrumentation-node';
import { Session } from '@/zitadel-server';

export default async function Page() {
  const sessionIds = getAllSessions().map((e) => e.sessionId);
  const sessionService = createSessionClient(serviceAccount);

  const sessions: Session[] = sessionIds.length
    ? await sessionService
        .listSessions({
          queries: [{ idsQuery: { ids: sessionIds } }],
        })
        .then((res) => res.sessions)
    : [];

  return <Home sessions={sessions} />;
}
