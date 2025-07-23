
export const runtime = 'edge';
export const interval = '0 3 * * *';

export default async function handler() { return new Response('drip'); }
