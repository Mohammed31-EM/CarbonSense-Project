const Plant = require('../../models/plant');
const Equipment = require('../../models/equipment');

const RESOURCE_PATH = '/maintenance';

const viewController = {
  index(req, res) {
    res.render('maintenance/Index', {
      maintenances: res.locals.data.maintenances || [],
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  show(req, res) {
    res.render('maintenance/Show', {
      ...res.locals.data,
      token: res.locals.data?.token || req.query.token || ''
    });
  },

  async newView(req, res) {
    try {
      const plants = await Plant.find().lean();
      const equipment = await Equipment.find().lean();
      const token = res.locals.data?.token || req.query.token || '';
      res.render('maintenance/New', { plants, equipment, token });
    } catch (err) {
      res.status(500).send('Error loading form data: ' + err.message);
    }
  },

  
  async edit(req, res) {
    try {
      const plants = await Plant.find().lean();
      const equipment = await Equipment.find().lean();
      res.render('maintenance/Edit', {
        ...res.locals.data,
        plants,
        equipment,
        token: res.locals.data?.token || req.query.token || ''
      });
    } catch (err) {
      res.status(500).send('Error loading form data: ' + err.message);
    }
  },

  redirectHome(req, res) {
    const token = req.query.token || res.locals.data?.token || '';
    if (token) {
      res.redirect(`${RESOURCE_PATH}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(RESOURCE_PATH);
    }
   
  },

  redirectShow(req, res) {
    const token = req.query.token || res.locals.data?.token || '';
    if (token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
    }
  }
};

module.exports = viewController;
