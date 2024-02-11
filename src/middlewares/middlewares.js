import { UnauthorizedError, NotFoundError } from '../error/error.js';
import pb from '../db/db.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

const middlewares = {
  /**
   * Redirecciona el usuario a la pagina inicial
   * si ya tiene una sesion activa
   * @param {Request} req
   * @param {Response} res
   */
  redirectIfLoggedIn(req, res, next) {
    if (req?.userData?.isLoggedIn) {
      return res.redirect('/');
    }

    next();
  },
  /**
   * Rellena la sesion del usuario una vez inicie sesion
   * @param {Request} req
   * @param {Response} res
   */
  populateUserSession(req, res, next) {
    try {
      if (!req.cookies.pb_auth) {
        return next();
      }

      const authCookie = `pb_auth=${req.cookies.pb_auth}`;
      pb.authStore.loadFromCookie(authCookie);

      if (!pb.authStore.isValid) {
        throw new UnauthorizedError('No se puedo validar la sesion');
      }

      pb.collection('users').authRefresh();
      pb.authStore.model.isLoggedIn = true;
      req.userData = pb.authStore.model;
      next();
    } catch (err) {
      console.log(err);
      if (err.message === 'invalid_session') return res.redirect('/login');

      next();
    }
  },
  /**
   * Muestra la pagina con el error encontrado
   * InternalServerError si el error no esta en los
   * especificados
   * @param {import('express').ErrorRequestHandler} err
   * @param {Request} req
   * @param {Response} res
   */
  renderError(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    console.log(`An error happened. Oh no!`);
    console.log(err.message);
    console.log(err);

    res.render('error/error', { error: statusCode });

    next();
  },
};

export default middlewares;
