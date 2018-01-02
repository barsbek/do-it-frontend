class Storage {
  constructor(prefix, id, storage = window.localStorage) {
    this.storage = storage;
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

  remove() {
    this.storage.removeItem(this.storageName);
  }

  clearSubItems(id) {
    if(this.prefix === 'collections') {
      const lists = new Storage(`collection-${id}`).data;
      lists.forEach(list => this.storage.removeItem(`list-${list.id}`));
      this.storage.removeItem(`collection-${id}`);
    }
    if(this.prefix === 'collection') {
      this.storage.removeItem(`list-${id}`)
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
