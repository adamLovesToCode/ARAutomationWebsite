const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export async function fetchAPI(
  path: string,
  options: RequestInit = {}
) {
  const mergedOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const requestUrl = `${STRAPI_URL}/api${path}`;

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Strapi API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Strapi API fetch error:', error);
    throw error;
  }
}
