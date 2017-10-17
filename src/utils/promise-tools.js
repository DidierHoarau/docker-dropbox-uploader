module.exports = {
  serialize(promiseArray) {
    return promiseArray.reduce((promise, item) => {
      return promise.then(() => {
        return item();
      });
    }, Promise.resolve());
  }
};
