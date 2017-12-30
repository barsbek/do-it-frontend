class Storage {
  constructor(name, storage = window.localStorage) {
    this.storage = storage;
    this.name = name;
    const item = JSON.parse(this.storage.getItem( name ));
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
      this.data, this.updated_at = { data, update_at };
      const s = JSON.stringify({ data, update_at });
      return this.storage.setItem(this.name, s);
      return true;
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
}

export default Storage;
