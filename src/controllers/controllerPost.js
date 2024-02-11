import util from '../util/util.js';
import pb from '../db/db.js';
import { BadRequestError, UnauthorizedError } from '../error/error.js';

/** @typedef {import("express").Request} Request */
/** @typedef {import("express").Response} Response */

const controllerPost = {
  /**
   * Crea un nuevo post
   * @param {Request} req
   * @param {Response} res
   */
  async createNewPost(req, res) {
    if (!req?.userData?.isLoggedIn) {
      throw new UnauthorizedError('El usuario no tiene una sesion activa');
    }

    const formData = new FormData();
    formData.append('user_id', req.userData.id);
    formData.append('title', req.body.post_title);
    formData.append('description', req.body.post_desc);
    formData.append('status', 'Open');
    formData.append('category', 1);
    formData.append('max_price', req.body.post_price);

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('pictures', blob, {
        filename: req.file.originalname,
      });
    }

    try {
      const record = await pb.collection('ads').create(formData);
      console.log(record);
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestError(`La informacion enviada no se lleno correctamente`);
      }
    }

    res.redirect('/');
  },
  /**
   * Crea un nuevo comentario
   * @param {Request} req
   * @param {Response} res
   */
  async createNewComment(req, res) {
    if (!req?.userData?.isLoggedIn) {
      throw new UnauthorizedError('No se ha iniciado sesion');
    }

    const { comment, price_offer, post } = req.body;

    try {
      const record = await pb.collection('offers').create(
        {
          user_id: req.userData.id,
          message: comment,
          price: price_offer,
          ad_id: post,
        },
        { expand: 'user_id' }
      );

      return res.render('_partials/htmx/newComment', { comment: record, relativeTime: util.relativeTime });
    } catch (err) {
      console.log(err);
    }
  },
};

export default controllerPost;
