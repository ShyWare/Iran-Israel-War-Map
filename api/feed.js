// This file would live in the /api directory of your project.
// It acts as the backend serverless function on Vercel.

const { kv } = require('@vercel/kv');
const fetch = require('node-fetch');

// The main function that Vercel will run when this endpoint is called.
export default async function handler(req, res) {
    const CACHE_KEY = 'news-feed-data';

    try {
        // First, try to get data from the cache (Vercel KV database)
        let cachedData = await kv.get(CACHE_KEY);

        if (cachedData) {
            console.log('Cache hit. Returning cached data.');
            // If data is found in the cache, return it immediately.
            res.setHeader('X-Cache-Status', 'HIT');
            return res.status(200).json(cachedData);
        }

        // --- If no cache, fetch fresh data ---
        console.log('Cache miss. Fetching new data from live sources.');
        
        // --- This is where you would fetch data from real APIs ---
        // Example: Fetching from NewsAPI.org
        // const NEWS_API_KEY = process.env.NEWS_API_KEY;
        // const newsUrl = `https://newsapi.org/v2/everything?q=Israel+Iran&apiKey=${NEWS_API_KEY}`;
        // const newsResponse = await fetch(newsUrl);
        // const newsData = await newsResponse.json();
        // You would then process `newsData.articles` to fit your format.
        
        // For this example, we'll use mock data to simulate a real fetch.
        const freshData = [
             { type: 'x-post', author: 'ShyWares', handle: 'ShyWares', avatar: 'https://placehold.co/40x40/0a0a0a/ef4444?text=S', content: 'Server cache revalidated. Pulling latest incident reports.', timestamp: '1m ago', verified: true },
             { type: 'news-article', source: 'Associated Press', headline: 'UN Security Council Calls for Emergency Meeting', summary: 'Diplomatic pressures mount as the conflict shows no signs of de-escalating.', timestamp: '1h ago', image: 'https://placehold.co/80x80/0a0a0a/ef4444?text=ALERT' }
        ];

        // Save the newly fetched data to the cache for 15 minutes (900 seconds).
        await kv.set(CACHE_KEY, freshData, { ex: 900 });
        console.log('New data fetched and cached.');

        // Return the fresh data to the app.
        res.setHeader('X-Cache-Status', 'MISS');
        return res.status(200).json(freshData);

    } catch (error) {
        console.error('Error in API feed:', error);
        return res.status(500).json({ error: 'Failed to fetch feed data.' });
    }
}
