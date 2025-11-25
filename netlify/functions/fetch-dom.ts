export const handler = async (event: any) => {
  const url = event.queryStringParameters.url;

  if (!url || !url.startsWith("https://practiscore.com/results")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ?url parameter." }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const encondedUrl = encodeURIComponent(url);
    const apiUrl = `http://api.scrape.do?url=${encondedUrl}&token=${process.env.SCRAPE_TOKEN}&render=true`;

    const response = await fetch(apiUrl, { method: "GET", headers: {} });
    console.log(response);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Scrape API error: ${response.status} ${response.statusText}`,
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = await response.text();

    return {
      statusCode: 200,
      body: data,
      headers: {
        "Content-Type": "text/html",
        "Netlify-CDN-Cache-Control": "public, max-age=31536000, durable",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected server error.",
        details:
          err instanceof Error ? err.message : "Unexpected error occured.",
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
