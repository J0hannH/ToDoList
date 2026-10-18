let storageTest;
function storageAvailable(type) {
  try {
    storageTest = window[type];
    const x = "__storage_test__";
    storageTest.setItem(x, x);
    storageTest.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storageTest &&
      storageTest.length !== 0
    );
  }
}

export { storageAvailable };
