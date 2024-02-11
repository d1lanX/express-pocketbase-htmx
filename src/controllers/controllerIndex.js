import util from '../util/util.js';
import pb from '../db/db.js';

/** @typedef {import("express").Request} Request */
/** @typedef {import("express").Response} Response */

const controllerIndex = {
  /**
   * Muestra la pagina inicial
   * @param {Request} req - Request
   * @param {Response} res - Response
   */
  async renderHomePage(req, res) {
    let resultList = [];

    try {
      resultList = await pb
        .collection('ads')
        .getList(1, 50, { expand: 'user_id, offers(ad_id).user_id', sort: '-created' });
    } catch (err) {
      console.log(err);
    }

    res.render('index', {
      userData: req.userData,
      posts: resultList,
      baseUrl: 'http://127.0.0.1:8090/api/files',
      relativeTime: util.relativeTime
    });
  },
  /**
   * Muestra el formulario de nuevo post
   * @param {Request} req
   * @param {Response} res
   */
  renderNewPostForm(req, res) {
    const { action } = req.query;
    if (action === 'cancel') {
      return res.status(200).send('');
    }

    res.render('_partials/htmx/formNewPost');
  },
};

export default controllerIndex;
