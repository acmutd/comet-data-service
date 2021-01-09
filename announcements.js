require('dotenv').config();

const { _getAll, _post, _findExact, _findFuzzy, _deleteById, _patch } = require('./crudHandler.js');

async function announcement_getAll(req, res) {
  const result = await _getAll(req.app.get('db').collection('announcements'));
  res.json(result);
}

async function announcement_post(req, res) {
  await _post(req.app.get('db').collection('announcements'),
    req.body,                       // new announcement object
    req.app.get('increment'),       // increment object
    'title'                  // reference key <--> collection key
  );
  res.json({ 'message': 'Announcement updated and counter updated' });
}

async function announcement_findById(req, res) {
  const result = await _findExact(
    req.app.get('db').collection('announcements'),
    'id',
    parseInt(req.params.id)
  );
  res.json(result);
}

async function announcement_findByName(req, res) {
  const name = req.params.name; // .toUpperCase();
  console.log(name);
  const result = await _findFuzzy(
    req.app.get('db').collection('announcements'),
    'title',
    name
  );
  res.json(result);
}

async function announcement_deleteById(req, res) {
  const result = await _deleteById(
    req.app.get('db').collection('announcements'),
    'id',
    parseInt(req.params.id),
    req.app.get('decrement')
  );
  res.json({ 'deleted': result });
}

async function announcement_patch(req, res) {
  const result = await _patch(
    req.app.get('db').collection('announcements'),
    parseInt(req.params.id),
    req.body
  );
  return res.json({ 'updated': result });
}

module.exports = {
  announcement_getAll, announcement_deleteById, announcement_findById, announcement_findByName, 
  announcement_patch, announcement_post
};
