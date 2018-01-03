class Storage {
  static storage = window.localStorage;

  constructor(prefix, id) {
    this.storage = Storage.storage;
    this.prefix = prefix;

    const storageName = (id && id !== 'new') ? `${prefix}-${id}` : prefix;

    this.storageName = storageName;
    const item = JSON.parse(this.storage.getItem( storageName ));
    if(item) {
      this.data = item.data;
      this.updated_at = item.update_at;
    }
  }

  get() {
    return this.data;
  }

  set(data, update_at) {
    try {
      this.data = data;
      this.updated_at = update_at;
      const s = JSON.stringify({ data, update_at });
      return this.storage.setItem(this.storageName, s);
    } catch(e) {
      return false;
    }
  }

  olderThan(update_at) {
    if(!this.updated_at || update_at > this.updated_at) {
      return true;
    }
    return false;
  }
    
  static delete(itemName) {
    this.storage.removeItem(itemName);
  }
}

export default Storage;
