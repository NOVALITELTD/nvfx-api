module.exports = (req, res) => {
  if (req.method === "POST") {
    console.log(req.body);
    return res.status(200).json({ status: "ok", success: true });
  }
  res.status(200).send("OK");
};

