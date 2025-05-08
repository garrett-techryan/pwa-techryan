const API_URL = "https://api.monday.com/v2";

export async function fetchBoardData(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.REACT_APP_MONDAY_API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    console.error("GraphQL errors:", data.errors);
    throw new Error("GraphQL query error");
  }

  return data;
}

export const writeBoardData = async (query) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.REACT_APP_MONDAY_API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data;
};