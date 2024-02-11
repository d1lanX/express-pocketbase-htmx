import pb from '../db/db.js';
import { InternalServerError, NotFoundError, UnauthorizedError } from '../error/error.js';

/** @typedef {import("express").Request} Request */
/** @typedef {import("express").Response} Response */

const controllerProfile = {
  /**
   * Muestra la pagina de perfil del usuario
   * @param {Request} req
   * @param {Response} res
   */
  async renderProfilePage(req, res) {
    /** @type {string} */
    const userId = req.params.id;
    let record;

    try {
      record = await pb.collection('users').getFirstListItem(`id="${userId}"`);
      console.log(record);
    } catch (err) {
      console.log(err);
      throw new NotFoundError(`No se encontro el perfil del usuario ${userId}`);
    }

    res.render('profile/profile', {
      userData: req.userData,
      userRecord: record,
      baseUrl: 'http://127.0.0.1:8090/api/files',
    });
  },
  /**
   * Muestra el formulario para editar la informacion de un usuario
   * @param {Request} req
   * @param {Response} res
   */
  async renderEditProfilePage(req, res) {
    const { uid, action } = req.query;
    let record;

    try {
      record = await pb.collection('users').getFirstListItem(`id="${uid}"`);
      console.log(record);
    } catch (err) {
      console.log(err);
      throw new NotFoundError(`No se encontro el perfil del usuario ${uid}`);
    }

    const view =
      action === 'cancel' ? '_partials/htmx/restoredProfileView' : '_partials/htmx/formEditUser';

    res.render(view, {
      userData: req.userData,
      userRecord: record,
      baseUrl: 'http://127.0.0.1:8090/api/files',
    });
  },
  /**
   * Actualiza la informacion de un usuario
   * @param {Request} req
   * @param {Response} res
   */
  async updateProfile(req, res) {
    /** @type {string} */
    const userId = req.params.id;

    if (!req?.userData?.isLoggedIn) {
      throw new UnauthorizedError('El usuario no tiene una sesion activa');
    }

    if (userId !== req?.userData?.id) {
      throw new UnauthorizedError('No se ha iniciado sesion o se intenta actualizar otro usuario');
    }

    const formData = new FormData();
    formData.append('id', userId);
    formData.append('name', req.body.name);
    formData.append('location', req.body.location);

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('avatar', blob, {
        filename: req.file.originalname,
      });
    }

    try {
      const record = await pb.collection('users').update(userId, formData);
      return res.render('_partials/htmx/restoredProfileView', {
        userData: req.userData,
        userRecord: record,
        baseUrl: 'http://127.0.0.1:8090/api/files',
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerError('Ocurrio un error al actualizar el usuario');
    }
  },
};

export default controllerProfile;
