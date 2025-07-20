const API_URL = "/api";  // ✅ Relative URL works with proxy

export async function fetchPolls() {
  const res = await fetch(`${API_URL}/polls`);
  return res.json();
}

export async function createPoll(poll) {
  const res = await fetch(`${API_URL}/poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(poll),
  });
  return res.json();
}

export async function vote(pollId, optionIndex) {
  const res = await fetch(`${API_URL}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pollId, optionIndex }),
  });
  return res.json();
}

