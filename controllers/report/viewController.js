const Plant = require('../../models/plant');

const RESOURCE_PATH = ('/report')

const viewController = { 
  index(req, res) {
    res.render('report/Index', { 
      reports: res.locals.data,
      token: req.query.token || ''
    });
  },

  show(req, res) {
    res.render('report/Show', { 
      reports: res.locals.data,
      token: req.query.token || ''
    });
  },

  edit(req, res) {
    res.render('report/Edit', { 
      reports: res.locals.data,
      token: req.query.token || ''
    });
  },

  async newView(req, res) {
    try {
      const plants = await Plant.find().lean();
      const token = req.query.token || '';
      res.render('report/New', { plants, token });
    } catch (err) {
      res.status(500).send('Error loading plants: ' + err.message);
    }
  },

  redirectHome(req, res) {
     token =
      req.query.token ||
      (res.locals.data && res.locals.data.token) ||
      '';
    if (token) {
      res.redirect(`${RESOURCE_PATH}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`${RESOURCE_PATH}`);
    }
  },

  redirectShow(req, res) {
    const token = req.query.token || '';
    if (token) {
      res.redirect(`/reports/${req.params.id}?token=${encodeURIComponent(token)}`);
    } else {
      res.redirect(`/reports/${req.params.id}`);
    }
  }
};

module.exports = viewController;
