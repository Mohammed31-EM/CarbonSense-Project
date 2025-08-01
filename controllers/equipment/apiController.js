// API JSON response controller for Equipment

const apiController = {
  index(req, res) {
    res.json(res.locals.data.equipments);
  },
  show(req, res) {
    res.json(res.locals.data.equipment);
  },
  create(req, res) {
    res.status(201).json(res.locals.data.equipment);
  },
  update(req, res) {
    res.json(res.locals.data.equipment);
  },
  destroy(req, res) {
    res.status(200).json({ message: 'Equipment deleted successfully' });
  }
};

module.exports = apiController;
