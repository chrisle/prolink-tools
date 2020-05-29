import express = require('express');

const HTTP_PORT = 8080;

export class Obs {

  private static instance: Obs;
  expressApp: express.Application;

  /**
   * Return or create and return a singleton instance of this class.
   */
  static Instance(): Obs {
    return this.instance || (this.instance = new this());
  }

  constructor() {
    this.expressApp = express();
    this.expressApp.get('/', (req, res) => { res.send('hello obs'); });
    this.expressApp.listen(HTTP_PORT);
  }

}