/**
 * Utility functions for handling requests and other operations.
 * El siguiente conjunto de metodos fue creado por erhhung (https://github.com/erhhung),
 * en el repositorio de postman-app-support donde se contestan ciertas dudas hacerca de las capacidades de postman,
 * la fuente original del codigo es: https://github.com/postmanlabs/postman-app-support/issues/3480#issuecomment-857163165
 * @namespace utils
 * @author erhhung (Modified by Carlos Santiago(carlossant47))
 */
const PORT = 8080;
const utils = {
  // use the open interval hack to wait until async
  // operations are done before sending the request
  // in a pre-request script
  waitUntilDone(promise) {
    const wait = setInterval(() => {}, 300000);
    promise.finally(() => clearInterval(wait));
  },

  // promisified pm.sendRequest()
  sendRequest(req) {
    return new Promise((resolve, reject) =>
      pm.sendRequest(req, (err, res) => {
        if (!err && res.code / 100 < 4) return resolve(res);
        let message = `Request "${req.url || req}" failed (${res.code})`;
        if (err?.message) message += `: ${err.message}`;
        reject({ message });
      })
    );
  },

  // load external library modules in order,
  // then return this[thisProp] or just this
  async loadModules(urls, thisProp = undefined) {
    const thisKeys = Object.keys(this);
    (await Promise.all(urls.map(this.sendRequest))).forEach((res) =>
      eval(res.text())
    );

    const thisObj = _.omit(this, thisKeys);
    //console.log('KEYS: this', Object.keys(thisObj));
    return (!thisProp && thisObj) || thisObj[thisProp];
  },

  /**
   * Injects base64-encoded files into the request body.
   * @param {RequestBody} requestBody - The request body object.
   * @author Carlos Santiago - (carlossant47)
   * @returns {Promise<void>} - A promise that resolves when the base64-encoded files are injected into the request body.
   */
  async inyectedBase64FileRequiered(requestBody) {
    try {
      let { mode, raw } = requestBody;
      if (mode !== "raw") {
        throw new Error("Raw mode is required");
      }
      const regex = /\{.*\| file_encoded\}/g;
      const regexExtractValue = /\{(.*?) \| file_encoded\}/;
      const requestMatchFiles = raw.match(regex);
      if (!requestMatchFiles) {
        throw new Error("Not detected match files");
      }

      const requestMatchFilesData = raw.match(regex).map((item) => {
        return { value: item.match(regexExtractValue)[1], replace: item };
      });

      for (const item of requestMatchFilesData) {
        console.log(
          `utils.inyectedBase64FileRequiered -> Reading ${item.value}`
        );
        let content = null;
        try {
          const response = await this.sendRequest({
            url: `http://localhost:${PORT}/files?path=${item.value}`,
            method: "GET",
          });
          if ((response.code = 200)) {
            content = response.json()["content"];
          }
        } catch (e) {
          console.warn(e.message);
        }
        raw = raw.replace(item.replace, content);
      }
      requestBody.raw = raw;
    } catch (e) {
      console.warn(e);
    }
  },

  async base64EncodeString(requestBody) {
    let { mode, raw } = requestBody;
    if (mode !== "raw") {
      throw new Error("Raw mode is required");
    }
    try {
      const regex = /\{'(.*?)' \| base64_encode\}/g;
      const regexExtracValue = /\{'(.*?)' \| base64_encode\}/;
      const matchesValues = (raw.match(regex) ?? []).map((item) => {
        return {
          value: item.match(regexExtracValue)[1] ?? null,
          replace: item,
        };
      });
      matchesValues.forEach((item) => {
        raw = raw.replace(item.replace, btoa(item.value));
      });
      requestBody.raw = raw;
    } catch (e) {
      console.warn(e);
    }
  },
};

utils.waitUntilDone(
  (async () => {
    const { body } = pm.request;
    await utils.base64EncodeString(body);
    await utils.inyectedBase64FileRequiered(body);
  })()
);
