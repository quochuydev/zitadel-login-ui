import { handler } from '#/services/oidc.service';

export const dynamic = 'force-dynamic';

// `handler` only reads request.nextUrl — no route params/searchParams props.
export { handler as GET, handler as POST };
