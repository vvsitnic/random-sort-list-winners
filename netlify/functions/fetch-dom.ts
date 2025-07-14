export const handler = async (event) => {
  const url = event.queryStringParameters.url;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`An error occured ${response.status}`);

    const html = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: html,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected error occured.",
      }),
    };
  }
};
