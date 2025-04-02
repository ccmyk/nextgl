// src/pages/api/pages/[id].js
export default function handler(req, res) {
  const pages = {
    "home-id": {
      id: "home-id",
      template: "home",
      content: "<h1>Home</h1>",
    },
    "about-id": {
      id: "about-id",
      template: "about",
      content: "<h1>About</h1>",
    },
  };

  const { id } = req.query;
  const page = pages[id];

  if (page) {
    res.status(200).json(page);
  } else {
    res.status(404).json({ error: "Page not found" });
  }
}