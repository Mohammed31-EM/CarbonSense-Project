
const apiController = {}

apiController.index = (req, res) => {

  res.json(res.locals.data.maintenance);
};

apiController.show = (req, res) => {
  res.json(res.locals.data.maintenance);
};

apiController.create = (req, res) => {
  res.status(201).json(res.locals.data.maintenance);
};

apiController.update = (req, res) => {
  res.status(200).json(res.locals.data.maintenance);
};

apiController.destroy = (req, res) => {
  res.status(200).json({ message: res.locals.data.message });
};

module.exports = apiController;