import express from "express"

const app = express()

app.get("/exchange_token/:user_code", async (req, res) => {
  const allowed_origin = process.env.ORIGIN_HOST ?? ""
  res.header("Access-Control-Allow-Origin", allowed_origin)

  const oauth_token_params = {
    "client_id": process.env.GH_CLIENT_ID ?? "",
    "client_secret": process.env.GH_CLIENT_SECRET ?? "",
    "code": req.params.user_code,
  }
  const oauth_token_url = "https://github.com/login/oauth/access_token"
  const oauth_token_response = await fetch(oauth_token_url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: new URLSearchParams(oauth_token_params),
  });
  if (!oauth_token_response.ok) { console.log(oauth_token_response); return res.sendStatus(400) }

  const oauth_token_result = await oauth_token_response.json();
  if (oauth_token_result.access_token === undefined) { return res.sendStatus(500) }

  const response_details = {
    "token": oauth_token_result.access_token,
  }
  res.json(response_details)
})

export default app
