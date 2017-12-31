class Storage {
  constructor(name, storage = window.localStorage) {
    this.storage = storage;
    this.name = name;
    this.currentPage = 1;
    const item = JSON.parse(this.storage.getItem( name ));
    if(item) {
      this.data = item.data;
      this.updated_at = item.update_at;
    }
  }

  getPage(page = 1) {
    this.currentPage = page;
    const s = this.storage.getItem(`${this.name}-${page}`)
    const item = JSON.parse( s );
    if(item) {
      this.data = item.data;
      this.updated_at = item.update_at;
    }
    return this.data;
  }

  setPage(item, page = 1) {
    try {
      this.data = item.data;
      this.updated_at = item.update_at;
      const s = JSON.stringify({ data, update_at });
      return this.storage.setItem(`${this.name}-${page}`, s);
    } catch(e) {
      return false;
    }
  }

  olderThan(update_at, page = 1) {
    // prevent getting page info for the second time
    if(!(this.currentPage === page || this.updated_at))
      this.get(page);
    if(!this.updated_at || update_at > this.updated_at) {
      return true;
    }
    return false;
  }
}

export default Storage;
