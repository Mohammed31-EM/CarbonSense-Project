const Plant = require('../../models/plant');
const Equipment = require('../../models/equipment')

const RESOURCE_PATH = '/equipment';

const viewController = {
  index(req, res) {
    res.render('equipment/Index', {
      equipments: res.locals.data.equipments,
      token: req.query.token || res.locals.data.token || ''
    });
  },
  show(req, res) {
    res.render('equipment/Show', {
      equipment: res.locals.data.equipment,
      token: req.query.token || res.locals.data.token || ''
    });
  },
  async edit(req, res) {
    try {
      const equipment = res.locals.data.equipment;
      const plants = await Plant.find().lean();
      res.render('equipment/Edit', {
        equipment,
        plants,
        token: req.query.token || res.locals.data.token || ''
      });
    } catch (err) {
      res.status(500).send('Error loading form data:' + err.message)
    }
    
  },
  async newView(req, res) {
    const Plant = require('../../models/plant');
    const plants = await Plant.find();
    res.render('equipment/New', {
      token: req.query.token || res.locals.data.token || '',
      plants
    });
  },
  redirectHome(req, res) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    if (token) {
      res.redirect(`${RESOURCE_PATH}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(RESOURCE_PATH);
    }
  },
  redirectShow(req, res) {
    const token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    if (token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${token}`);
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
    }
  }
};

module.exports = viewController;
