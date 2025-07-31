exports.index = (req, res) => {
  res.json(res.locals.data.maintenance);
};

exports.show = (req, res) => {
  res.json(res.locals.data.maintenance);
};

exports.create = (req, res) => {
  res.status(201).json(res.locals.data.maintenance);
};

exports.update = (req, res) => {
  res.status(200).json(res.locals.data.maintenance);
};

exports.destroy = (req, res) => {
  res.status(200).json({ message: res.locals.data.message });
};
