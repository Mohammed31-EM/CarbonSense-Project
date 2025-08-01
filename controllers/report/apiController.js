const apiController = {};

apiController.index = (req, res) => {
  res.json(res.locals.data.reports);
};

apiController.show = (req, res) => {
  res.json(res.locals.data.report);
};

apiController.create = (req, res) => {
  res.status(201).json(res.locals.data.report);
};

apiController.update = (req, res) => {
  res.json(res.locals.data.report);
};

apiController.destroy = (req, res) => {
  res.json({ message: res.locals.data.message });
};

module.exports = apiController;
