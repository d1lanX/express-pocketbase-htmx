import { InternalServerError } from '../error/error.js';

import pb from '../db/db.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

const controllerAuth = {
  renderAuthPage(req, res) {
    res.render('auth/auth', { title: 'inicio sesion / registro' });
  },
  /**
   * Inicia la sesion de un usuario
   * @param {Request} req
   * @param {Response} res
   */
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      await pb.collection('users').authWithPassword(email, password);

      const cookie = pb.authStore.exportToCookie({
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.ENVIRONMENT === 'production',
      });

      res.cookie(cookie);
      res.redirect('/');
    } catch (err) {
      if (err.status === 500) {
        throw new InternalServerError();
      }

      if (err.status === 400) {
        res.render('auth/auth', {
          serverResponse: 'Correo o contraseña incorrectos',
          email,
        });
      }
    }
  },
  /**
   * Registra un usuario
   * @param {Request} req
   * @param {Response} res
   */
  async signupUser(req, res) {
    const { email, password } = req.body;

    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
      });
    } catch (err) {
      if (err.status === 500) {
        throw new InternalServerError();
      }

      if (err.status === 400) {
        const message = `El correo es inválido o ya se encuentra en uso`;
        return res.render('auth/auth', { serverResponse: message, email });
      }
    }

    res.render('auth/auth', {
      message: 'Registro completado',
      email,
      password,
    });
  },
  /**
   * Cierra la sesion del usuario
   * @param {Request} req
   * @param {Response} res
   */
  logout(req, res, next) {
    try {
      req.session = null;
      res.clearCookie('pb_auth');
      res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  }
};

export default controllerAuth;
