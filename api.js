export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwYWY4YTIzZS0wZGE5LTQ0OTUtOGY3Ny0yOGMwNjA0MTBlODciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTIzMzQyMywiZXhwIjoxOTAzMDIxNDIzfQ.qoeM68-1P-mk6Yq8eCbNb8oGz-qzlB6Sm8-nU4ITh9M";
// API call to create meeting
export const createMeeting = async ({token}) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const {roomId} = await res.json();
  console.log('room id', roomId);
  return roomId;
};
