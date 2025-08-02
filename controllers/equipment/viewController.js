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
  edit(req, res) {
    res.render('equipment/Edit', {
      equipment: res.locals.data.equipment,
      token: req.query.token || res.locals.data.token || ''
    });
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
    const token = req.query.token || res.locals.data.token || '';
    if (token) {
      res.redirect(`/plants?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect('/plants');
    }
  },
  redirectShow(req, res) {
    if (res.locals.data.token) {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}?token=${res.locals.data.token}`);
    } else {
      res.redirect(`${RESOURCE_PATH}/${req.params.id}`);
    }
  }
};

module.exports = viewController;
